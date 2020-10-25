interface ControllerShared {
    isElementHighlighted(): boolean;
    isElementReadied(): boolean;
    isElementTriggered(): boolean;
    isElementToggled(): boolean;
    isElementQueried(): boolean;
    isElementDragged(): boolean;
    isElementInteracted(): boolean;
    isChildInteracted(): boolean;
    isFloatingChildInteracted(): boolean;
    getDragX(): number;
    getDragY(): number;
}

export interface ControllerAPI extends ControllerShared {}

export interface ControllerManager extends ControllerAPI {
    onPostRender(): void;
}

export interface Controller extends ControllerShared {
    onPostRender?(): void;
}
