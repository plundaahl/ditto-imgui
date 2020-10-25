import { UiElement } from '../../../types';
import { FocusService } from './FocusService';
import { FocusAction, NextFocusAction, PrevFocusAction } from './FocusAction';

export class FocusServiceImpl implements FocusService {

    private readonly nextFocusAction: FocusAction;
    private readonly prevFocusAction: FocusAction;

    protected readonly focusableElements: UiElement[] = [];
    protected readonly elementStack: UiElement[] = [];

    protected focusedElement: string | undefined;
    private readonly focusedParents: string[] = [];
    private readonly focusedFloatParents: string[] = [];

    protected nextElementToFocus: UiElement | undefined;
    private elementWasSeen: boolean = false;
    private focusChanged: boolean = false;

    protected action: FocusAction | undefined;
    protected prevFocusableElement: UiElement | undefined;
    protected curFocusableElement: UiElement | undefined;

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
        this.unsetFocusedElementIfNotSeen = this.unsetFocusedElementIfNotSeen.bind(this);
        this.updateFocusedElement = this.updateFocusedElement.bind(this);
        this.runActionOnPreRender = this.runActionOnPreRender.bind(this);
        this.resetFocusableElements = this.resetFocusableElements.bind(this);

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
        const curElement = this.currentElement;
        if (!curElement) {
            throw new Error('No element currently active');
        }

        if (!this.focusableElements.includes(curElement)) {
            throw new Error('Current element is not focusable. Please call setFocusable() first');
        }

        this.doFocusOnElement(curElement);
    }

    setFocusable(): void {
        if (!this.currentElement) {
            throw new Error('No element currently pushed');
        }

        this.focusableElements.push(this.currentElement);
        this.prevFocusableElement = this.curFocusableElement;
        this.curFocusableElement = this.currentElement;

        if (this.focusedElement === this.currentElement.key) {
            this.elementWasSeen = true;
            this.nextElementToFocus = this.nextElementToFocus || this.currentElement;
        }

        if (this.action) {
            this.action.onSetFocusable(
                this.focusedElement,
                this.prevFocusableElement,
                this.curFocusableElement,
            );
        }
    }

    private doFocusOnElement(element: UiElement) {
        this.nextElementToFocus = element;
        this.elementWasSeen = true;
        delete this.action;
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

        this.runActionOnPreRender();
        this.calcDidFocusChange();
        this.unsetFocusedElementIfNotSeen();
        this.updateFocusedElement();
        this.resetFocusableElements();
    }

    private runActionOnPreRender() {
        if (this.action) {
            this.action.onPreRender(
                this.focusedElement,
                this.focusableElements[0],
                this.focusableElements[this.focusableElements.length - 1],
            );
            delete this.action;
        }
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
}
