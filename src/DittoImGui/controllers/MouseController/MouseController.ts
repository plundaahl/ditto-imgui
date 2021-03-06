import { MouseCPI } from '../../services/MouseService';
import { FocusCPI } from '../../services/FocusService';
import { Controller } from '../Controller';

export class MouseController implements Controller {
    private hoversElement: boolean = false;

    constructor(
        private readonly mouse: MouseCPI,
        private readonly focus: FocusCPI,
    ) {
        this.isElementHighlighted = this.isElementHighlighted.bind(this);
        this.isElementReadied = this.isElementReadied.bind(this);
        this.isElementTriggered = this.isElementTriggered.bind(this);
        this.isElementToggled = this.isElementToggled.bind(this);
        this.isElementQueried = this.isElementQueried.bind(this);
        this.isElementDragged = this.isElementDragged.bind(this);
        this.isElementInteracted = this.isElementInteracted.bind(this);
        this.isChildInteracted = this.isChildInteracted.bind(this);
        this.isFloatingChildInteracted = this.isFloatingChildInteracted.bind(this);
        this.getDragX = this.getDragX.bind(this);
        this.getDragY = this.getDragY.bind(this);
    }

    onBeginElement(): void {
        const { focus, mouse } = this;

        if (!this.mouse.hoversElement()) {
            return;
        }

        this.hoversElement = true;
        const mouseWasInteracted = mouse.isM1Down() || mouse.isM2Down();

        if (focus.isElementFocusable() && mouseWasInteracted) {
            focus.focusElement();
        }
    }

    onPreRender(): void {
        const { mouse } = this;
        const mouseWasInteracted = mouse.isM1Down() || mouse.isM2Down();

        if (!this.hoversElement && mouseWasInteracted) {
            this.focus.blur();
        }

        this.hoversElement = false;
    }

    isElementHighlighted(): boolean {
        return this.mouse.hoversElement();
    }

    isElementReadied(): boolean {
        const { mouse } = this;
        return mouse.hoversElement() && mouse.isM1Down();
    }

    isElementTriggered(): boolean {
        const { mouse } = this;
        return mouse.hoversElement() && mouse.isM1Clicked();
    }

    isElementToggled(): boolean {
        const { mouse } = this;
        return mouse.hoversElement() && mouse.isM1DoubleClicked();
    }

    isElementQueried(): boolean {
        const { mouse } = this;
        return mouse.hoversElement() && mouse.isM2Clicked();
    }

    isElementDragged(): boolean {
        const { mouse } = this;
        return mouse.hoversElement() && mouse.isM1Dragged();
    }

    isElementInteracted(): boolean {
        const { mouse } = this;
        return mouse.hoversElement() && (mouse.isM1Down() || mouse.isM2Down());
    }

    isChildInteracted(): boolean {
        const { mouse } = this;
        return mouse.hoversChild() && (mouse.isM1Down() || mouse.isM2Down());
    }

    isFloatingChildInteracted(): boolean {
        const { mouse } = this;
        return mouse.hoversFloatingChild() && (mouse.isM1Down() || mouse.isM2Down());
    }

    getDragX(): number {
        const { mouse } = this;
        return mouse.isM1Dragged()
            ? mouse.getDragX()
            : 0;
    }

    getDragY(): number {
        const { mouse } = this;
        return mouse.isM1Dragged()
            ? mouse.getDragY()
            : 0;
    }
}
