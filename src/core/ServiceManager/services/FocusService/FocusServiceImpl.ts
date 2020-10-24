import { UiElement } from '../../../types';
import { FocusService } from './FocusService';
import { FocusAction, NextFocusAction, PrevFocusAction } from './FocusAction';

export class FocusServiceImpl implements FocusService {

    private readonly nextFocusAction: FocusAction;
    private readonly prevFocusAction: FocusAction;

    protected readonly focusableElements: string[] = [];
    protected readonly elementStack: UiElement[] = [];

    protected action: FocusAction | undefined;
    protected prevFocusableElement: string | undefined;
    protected curFocusableElement: string | undefined;
    protected focusedElement: string | undefined;
    protected nextElementToFocus: string | undefined;

    constructor() {
        this.onPreRender = this.onPreRender.bind(this);
        this.onWillRenderElement = this.onWillRenderElement.bind(this);
        this.onEndElement = this.onEndElement.bind(this);
        this.onBeginElement = this.onBeginElement.bind(this);
        this.isElementFocused = this.isElementFocused.bind(this);
        this.setFocusable = this.setFocusable.bind(this);
        this.focusElement = this.focusElement.bind(this); this.incrementFocus = this.incrementFocus.bind(this);
        this.decrementFocus = this.decrementFocus.bind(this);
        this.doFocusOnElement = this.doFocusOnElement.bind(this);

        this.nextFocusAction = new NextFocusAction(this.doFocusOnElement);
        this.prevFocusAction = new PrevFocusAction(this.doFocusOnElement);
    }

    protected get currentElement(): UiElement | undefined {
        return this.elementStack[this.elementStack.length - 1];
    }

    incrementFocus(): void {
        this.action = this.nextFocusAction;
    }

    decrementFocus(): void {
        this.action = this.prevFocusAction;
    }

    focusElement(): void {
        const curElementKey = this.currentElement && this.currentElement.key;
        if (!curElementKey) {
            throw new Error('No element currently active');
        }

        if (!this.focusableElements.includes(curElementKey)) {
            throw new Error('Current element is not focusable. Please call setFocusable() first');
        }

        this.doFocusOnElement(curElementKey);
    }

    setFocusable(): void {
        if (!this.currentElement) {
            throw new Error('No element currently pushed');
        }

        this.focusableElements.push(this.currentElement.key);
        this.prevFocusableElement = this.curFocusableElement;
        this.curFocusableElement = this.currentElement.key;

        if (this.action) {
            this.action.onSetFocusable(
                this.focusedElement,
                this.prevFocusableElement,
                this.curFocusableElement,
            );
        }
    }

    private doFocusOnElement(element: string) {
        this.nextElementToFocus = element;
        delete this.action;
    }

    isElementFocused(): boolean {
        if (!this.currentElement) {
            throw new Error('No element currently active');
        }
        
        const { key } = this.currentElement;
        if (!this.focusableElements.includes(key)) {
            throw new Error('Current element is not focusable. Call setFocusable first.');
        }
        return key === this.focusedElement;
    }

    isChildFocused(): boolean {
        throw new Error('not yet implemented');
    }

    isFloatingChildFocused(): boolean {
        throw new Error('not yet implemented');
    }

    onBeginElement(element: UiElement): void {
        this.elementStack.push(element);
    }

    onEndElement(): void {
        this.elementStack.pop();
    }

    onWillRenderElement(element: UiElement, context: CanvasRenderingContext2D): void {
        throw new Error('Method not implemented.');
    }

    onPreRender(): void {
        if (this.currentElement) {
            throw new Error('Do not call onPreRender while elements are on stack');
        }

        this.focusedElement = this.nextElementToFocus;
        delete this.prevFocusableElement;
        delete this.curFocusableElement;

        if (this.action) {
            this.action.onPreRender(
                this.focusedElement,
                this.focusableElements[0],
                this.focusableElements[this.focusableElements.length - 1],
            );
            delete this.action;
        }

        this.focusableElements.length = 0;
    }
}
