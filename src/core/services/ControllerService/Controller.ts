export interface Controller {
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
