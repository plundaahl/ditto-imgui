import { MouseContext } from './MouseContext';
import { ElementActiveState } from './ElementActiveState';

export class CurElementContext {
    private currentElementId: number = 0;
    private activeElementId: number = -1;

    constructor(
        private readonly mouseContext: MouseContext,
    ) { }

    onPostRender(): void {
        this.currentElementId = 0;

        if (this.activeElementId < 0 && this.mouseContext.isMouseDown()) {
            this.activeElementId = 0;
        }

        if (!this.mouseContext.isMouseDown()) {
            this.activeElementId = -1;
        }
    }

    nextElement(): void {
        this.currentElementId++;
        this.setActiveElement();
    }

    isCurElementActive(): boolean {
        return this.activeElementId === this.currentElementId;
    }

    private setActiveElement() {
        const { mouseContext } = this;
        let state: ElementActiveState;

        if (this.activeElementId >= 0) {
            state = ElementActiveState.OTHER;
        } else if (mouseContext.isMouseDown() && mouseContext.isCurElementUnderMouse()) {
            state = ElementActiveState.THIS;
            this.activeElementId = this.currentElementId;
        } else {
            state = ElementActiveState.NONE;
        }

        this.mouseContext.activeElement = state;
    }
}
