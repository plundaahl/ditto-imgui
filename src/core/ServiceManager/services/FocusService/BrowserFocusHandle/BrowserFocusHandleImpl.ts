import { BrowserFocusHandle } from './BrowserFocusHandle';

interface ListenableHtmlElement {
    addEventListener(event: string, fn: (e: Event) => void): void;
}

interface FocusableHtmlElement {
    focus(): void;
    addEventListener(event: string, fn: (e: Event) => void): void;
    setAttribute(attr: string, value: any): void;
    removeAttribute(attr: string): void;
}

const ATTR_DISABLED = 'disabled';
const EVENT_CLICK = 'click';
const EVENT_AUXCLICK = 'auxclick';
const EVENT_MOUSEDOWN = 'mousedown';
const EVENT_CONTEXTMENU = 'contextmenu';
const EVENT_SCROLL = 'scroll';
const EVENT_FOCUS = 'focus';
const EVENT_BLUR = 'blur';

export class BrowserFocusHandleImpl implements BrowserFocusHandle {
    private internallyFocusedElementIsFirst: boolean = true;
    private internallyFocusedElementIsLast: boolean = true;
    private onAppFocusListeners: { (): void }[] = [];
    private onAppBlurListeners: { (): void }[] = [];
    private blurTimeout: any;
    private focusWasTriggered: boolean = false;
    private appIsFocused: boolean = false;

    constructor(
        root: ListenableHtmlElement,
        private readonly tabBackwardsTrap: FocusableHtmlElement,
        private readonly tabCenterTrap: FocusableHtmlElement,
        private readonly tabForwardsTrap: FocusableHtmlElement,
    ) {
        this.isAppFocused = this.isAppFocused.bind(this);
        this.focusApp = this.focusApp.bind(this);
        this.setIsFocusedOnLastElement = this.setIsFocusedOnLastElement.bind(this);
        this.setIsFocusedOnFirstElement = this.setIsFocusedOnFirstElement.bind(this);
        this.onAppFocus = this.onAppFocus.bind(this);
        this.onAppBlur = this.onAppBlur.bind(this);

        this.focusCenterTrap = this.focusCenterTrap.bind(this);
        this.handleCenterTrapFocused = this.handleCenterTrapFocused.bind(this);
        this.handleCenterTrapBlurred = this.handleCenterTrapBlurred.bind(this);
        this.handleCanvasInteracted = this.handleCanvasInteracted.bind(this);
        this.resolveBlur = this.resolveBlur.bind(this);
        this.unsetFocusWasTriggered = this.unsetFocusWasTriggered.bind(this);
        this.handleCanvasClicked = this.handleCanvasClicked.bind(this);

        root.addEventListener(EVENT_CLICK, this.focusCenterTrap);
        root.addEventListener(EVENT_AUXCLICK, this.focusCenterTrap);
        root.addEventListener(EVENT_SCROLL, this.focusCenterTrap);
        root.addEventListener(EVENT_MOUSEDOWN, this.handleCanvasInteracted);
        root.addEventListener(EVENT_CONTEXTMENU, this.handleCanvasInteracted);
        
        tabForwardsTrap.addEventListener(EVENT_FOCUS, this.focusCenterTrap);
        tabBackwardsTrap.addEventListener(EVENT_FOCUS, this.focusCenterTrap);
        tabCenterTrap.addEventListener(EVENT_FOCUS, this.handleCenterTrapFocused);
        tabCenterTrap.addEventListener(EVENT_BLUR, this.handleCenterTrapBlurred);
    }

    isAppFocused(): boolean {
        return this.appIsFocused;
    }

    focusApp(): void {
        this.tabCenterTrap.focus();
    }

    setIsFocusedOnLastElement(isFocusedOnLastElement: boolean): void {
        this.internallyFocusedElementIsLast = isFocusedOnLastElement;
    }

    setIsFocusedOnFirstElement(isFocusedOnFirstElement: boolean): void {
        this.internallyFocusedElementIsFirst = isFocusedOnFirstElement;
    }

    onAppFocus(fn: () => void): void {
        this.onAppFocusListeners.push(fn);
    }

    onAppBlur(fn: () => void): void {
        this.onAppBlurListeners.push(fn);
    }

    private handleCanvasInteracted(e: Event) {
        e.preventDefault();
        this.focusWasTriggered = true;
        setTimeout(this.unsetFocusWasTriggered, 0);
    }
    
    private handleCanvasClicked() {
        this.focusCenterTrap();
    }

    private focusCenterTrap() {
        this.tabCenterTrap.focus();
    }

    private handleCenterTrapFocused(e: Event) {
        this.handleCanvasInteracted(e);
        if (this.blurTimeout) {
            clearTimeout(this.blurTimeout);
        }

        this.setAppFocusedState(true);

        if (this.internallyFocusedElementIsFirst) {
            this.tabBackwardsTrap.setAttribute(ATTR_DISABLED, true);
        } else {
            this.tabBackwardsTrap.removeAttribute(ATTR_DISABLED);
        }

        if (this.internallyFocusedElementIsLast) {
            this.tabForwardsTrap.setAttribute(ATTR_DISABLED, true);
        } else {
            this.tabForwardsTrap.removeAttribute(ATTR_DISABLED);
        }
    }

    private handleCenterTrapBlurred() {
        if (this.focusWasTriggered) {
            return;
        }
        this.blurTimeout = setTimeout(this.resolveBlur, 0);
    }

    private resolveBlur() {
        this.setAppFocusedState(false);
        this.tabForwardsTrap.setAttribute(ATTR_DISABLED, true);
        this.tabBackwardsTrap.setAttribute(ATTR_DISABLED, true);
    }

    private setAppFocusedState(focused: boolean) {
        if (this.appIsFocused !== focused) {
            const listeners = focused
                ? this.onAppFocusListeners
                : this.onAppBlurListeners;

            for (const fn of listeners) {
                fn();
            }
        }

        this.appIsFocused = focused;
    }

    private unsetFocusWasTriggered() {
        this.focusWasTriggered = false;
    }
}
