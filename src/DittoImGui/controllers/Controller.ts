import { NoArgHookable } from './NoArgHookable';

export interface ControllerAPI {
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

export interface Controller extends ControllerAPI, Partial<NoArgHookable> {}
