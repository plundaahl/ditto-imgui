import { UiElement } from '../../types';
import { FOCUSABLE } from '../../flags';
import { FocusService } from './FocusService';
import { BrowserFocusHandle } from './BrowserFocusHandle';

export class FocusServiceImpl implements FocusService {

    protected readonly focusableElements: UiElement[] = [];
    protected readonly elementStack: UiElement[] = [];

    protected focusedElement: string | undefined;
    private readonly focusedParents: string[] = [];
    private readonly focusedFloatParents: string[] = [];

    protected nextElementToFocus: UiElement | undefined;
    private elementWasSeen: boolean = false;
    private focusChanged: boolean = false;

    protected prevFocusableElement: UiElement | undefined;
    protected curFocusableElement: UiElement | undefined;

    constructor(
        private readonly browserFocusHandle: BrowserFocusHandle,
    ) {
        this.onPreRender = this.onPreRender.bind(this);
        this.onEndElement = this.onEndElement.bind(this);
        this.onBeginElement = this.onBeginElement.bind(this);
        this.isElementFocused = this.isElementFocused.bind(this);
        this.focusElement = this.focusElement.bind(this);
        this.doFocusOnElement = this.doFocusOnElement.bind(this);
        this.unsetFocusedElementIfNotSeen = this.unsetFocusedElementIfNotSeen.bind(this);
        this.updateFocusedElement = this.updateFocusedElement.bind(this);
        this.resetFocusableElements = this.resetFocusableElements.bind(this);
        this.handleAppBlur = this.handleAppBlur.bind(this);

        browserFocusHandle.onAppBlur(this.handleAppBlur);
    }

    protected get currentElement(): UiElement | undefined {
        return this.elementStack[this.elementStack.length - 1];
    }

    focusElement(): void {
        const curElement = this.currentElement;
        if (!curElement) {
            throw new Error('No element currently active');
        }

        if (!this.focusableElements.includes(curElement)) {
            throw new Error('Current element is not focusable. Please ensure element has the FOCUSABLE flag');
        }

        this.doFocusOnElement(curElement);
    }

    private doFocusOnElement(element: UiElement) {
        this.browserFocusHandle.focusApp();
        this.nextElementToFocus = element;
        this.elementWasSeen = true;
    }

    isElementFocused(): boolean {
        const { currentElement, focusedElement } = this;

        if (!currentElement) {
            throw new Error('No element currently active');
        }
        
        if (!this.focusableElements.includes(currentElement)) {
            throw new Error('Current element is not focusable. Call setFocusable first.');
        }

        return Boolean(focusedElement && (currentElement.key === focusedElement));
    }

    isChildFocused(): boolean {
        const { currentElement } = this;
        if (!currentElement) {
            return false;
        }
        return this.focusedParents.includes(currentElement.key);
    }

    isFloatingChildFocused(): boolean {
        const { currentElement } = this;
        if (!currentElement) {
            return false;
        }
        return this.focusedFloatParents.includes(currentElement.key);
    }

    didFocusChange(): boolean {
        return this.focusChanged;
    }

    onBeginElement(element: UiElement): void {
        this.elementStack.push(element);

        if (element.flags & FOCUSABLE) {
            this.focusableElements.push(element);
            this.prevFocusableElement = this.curFocusableElement;
            this.curFocusableElement = element;

            if (this.focusedElement === element.key) {
                this.elementWasSeen = true;
                this.nextElementToFocus = this.nextElementToFocus || element;
            }
        }
    }

    onEndElement(): void {
        this.elementStack.pop();
    }

    onPreRender(): void {
        if (this.currentElement) {
            throw new Error('Do not call onPreRender while elements are on stack');
        }

        this.calcDidFocusChange();
        this.unsetFocusedElementIfNotSeen();
        this.updateFocusedElement();
        this.resetFocusableElements();
    }

    private unsetFocusedElementIfNotSeen() {
        if (!this.elementWasSeen) {
            this.focusedElement = undefined;
        }
        this.elementWasSeen = false;
    }

    private calcDidFocusChange() {
        const { focusedElement, elementWasSeen } = this;
        const nextKey = this.nextElementToFocus
            ? this.nextElementToFocus.key
            : focusedElement;

        this.focusChanged = (focusedElement && !elementWasSeen) || (focusedElement !== nextKey);
    }

    private updateFocusedElement() {
        const focusedElement = this.nextElementToFocus;

        this.focusedParents.length = 0;
        this.focusedFloatParents.length = 0;

        if (focusedElement) {
            for (let e = focusedElement.parent; e; e = e.parent) {
                if (e.layer.key === focusedElement.layer.key) {
                    this.focusedParents.push(e.key);
                } else {
                    this.focusedFloatParents.push(e.key);
                }
            }
        }

        this.focusedElement = focusedElement ? focusedElement.key : undefined;
    }

    private resetFocusableElements() {
        delete this.nextElementToFocus;
        delete this.prevFocusableElement;
        delete this.curFocusableElement;
        this.focusableElements.length = 0;
    }

    private handleAppBlur() {
        delete this.focusedElement;
        this.focusedParents.length = 0;
        this.focusedFloatParents.length = 0;
    }
}
