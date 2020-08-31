import { MouseContext } from './MouseContext';
import { ElementActiveState } from './shared';

export interface ICurElementContext {
    isActive(): boolean;
    isHot(): boolean;
    isTriggered(): boolean;
}

export class CurElementContext implements ICurElementContext {

    private parentElementIdStack: number[] = [];
    private nextElementId: number = 1;
    private currentElementId: number = 0;
    private activeElementId: number = -1;

    constructor(
        private readonly mouseContext: MouseContext,
    ) { }

    onPostRender(): void {
        this.nextElementId = 1;
        this.currentElementId = 0;

        if (!this.mouseContext.isMouseDown()) {
            this.activeElementId = -1;
        } else if (this.activeElementId < 0) {
            this.activeElementId = 0;
        }
    }

    pushElement(): void {
        if (this.currentElementId > 0) {
            this.parentElementIdStack.push(this.currentElementId);
        }
        this.currentElementId = this.nextElementId++;
        this.setActiveElement();
    }

    popElement(): void {
        this.currentElementId = this.parentElementIdStack.pop() || 0;
    }

    isActive(): boolean {
        return this.currentElementId > 0 && this.activeElementId === this.currentElementId;
    }

    isHot(): boolean {
        return this.mouseContext.isCurElementHovered();
    }

    isTriggered(): boolean {
        return this.mouseContext.isCurElementClicked();
    }

    private setActiveElement() {
        const { mouseContext } = this;
        let state: ElementActiveState;

        if (this.activeElementId < 0) {
            if (mouseContext.isMouseDown() && mouseContext.isCurElementUnderMouse()) {
                state = ElementActiveState.THIS;
                this.activeElementId = this.currentElementId;
            } else {
                state = ElementActiveState.NONE;
            }
        } else if (this.activeElementId === 0) {
            state = ElementActiveState.OTHER;
        } else {
            if (this.activeElementId === this.currentElementId) {
                state = ElementActiveState.THIS;
            } else {
                state = ElementActiveState.OTHER;
            }
        }

        this.mouseContext.activeElement = state;
    }
}
