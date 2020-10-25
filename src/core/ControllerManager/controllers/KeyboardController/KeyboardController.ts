import { Controller } from '../..';
import { KeyboardCPI } from '../../../ServiceManager/services/KeyboardService';
import { FocusCPI } from '../../../ServiceManager/services/FocusService';
import { KeyMap } from './KeyMap';

export class KeyboardController implements Controller {

    private queried: boolean = false;
    private readied: boolean = false;
    private triggered: boolean = false;
    private toggled: boolean = false;
    private dragged: boolean = false;
    private interacted: boolean = false;

    constructor(
        private readonly keyboard: KeyboardCPI,
        private readonly focus: FocusCPI,
        private readonly keyMap: KeyMap,
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
        this.onPostRender = this.onPostRender.bind(this);
        this.isKeyDown = this.isKeyDown.bind(this);
        this.isKeyEntered = this.isKeyEntered.bind(this);
    }

    isElementHighlighted(): boolean {
        return false;
    }

    isElementReadied(): boolean {
        return this.readied && this.focus.isElementFocused();
    }

    isElementTriggered(): boolean {
        return this.triggered && this.focus.isElementFocused();
    }

    isElementToggled(): boolean {
        return this.toggled && this.focus.isElementFocused();
    }

    isElementQueried(): boolean {
        return this.queried && this.focus.isElementFocused();
    }

    isElementDragged(): boolean {
        return this.dragged && this.focus.isElementFocused();
    }

    isElementInteracted(): boolean {
        return this.interacted && this.focus.isElementFocused();
    }

    isChildInteracted(): boolean {
        return this.interacted && this.focus.isChildFocused();
    }

    isFloatingChildInteracted(): boolean {
        return this.interacted && this.focus.isFloatingChildFocused();
    }

    getDragX(): number {
        throw new Error('Method not implemented.');
    }

    getDragY(): number {
        throw new Error('Method not implemented.');
    }

    onPostRender(): void {
        this.readied = this.isKeyDown('trigger');

        this.triggered = this.isKeyEntered('trigger')
            && !this.isKeyDown('cancel');

        this.toggled = this.isKeyEntered('toggle')
            && !this.isKeyDown('cancel');

        this.queried = this.isKeyEntered('query')
            && !this.isKeyDown('cancel');

        this.dragged = this.isKeyEntered('moveUp')
            || this.isKeyEntered('moveDown')
            || this.isKeyEntered('moveLeft')
            || this.isKeyEntered('moveRight');

        this.interacted = this.readied
            || this.triggered
            || this.toggled
            || this.queried
            || this.dragged;
    }

    private isKeyDown(key: keyof KeyMap): boolean {
        const { keyboard } = this;
        for (const code of this.keyMap[key]) {
            if (keyboard.isCodeDown(code)) {
                return true;
            }
        }
        return false;
    }

    private isKeyEntered(key: keyof KeyMap): boolean {
        const { keyboard } = this;
        for (const code of this.keyMap[key]) {
            if (keyboard.isCodeEntered(code)) {
                return true;
            }
        }
        return false;
    }
}
