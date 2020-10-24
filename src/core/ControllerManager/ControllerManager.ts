interface ActionProvider {
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

export interface ControllerAPI extends ActionProvider {}
export interface ControllerManager extends ControllerAPI { }
export interface Controller extends ActionProvider { }
