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

export interface ActionAPI extends ActionProvider {
    registerPlugin(provider: ActionPlugin): void;
}

export interface ActionPluginManager extends ActionAPI { }
export interface ActionPlugin extends ActionProvider { }
