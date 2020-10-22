import { UiElement } from "./types";
import { DrawAPI } from './systems/DrawHandler';
import { MouseAPI } from './systems/MouseHandler';
import { StateAPI } from './systems/StateManager';
import { LayoutAPI } from './systems/LayoutHandler';
import { FocusAPI } from './systems/FocusManager';
import { ActionAPI } from './systems/ActionPluginManager';

export interface GuiContext {
    beginLayer(key: string): void;
    endLayer(): void;

    beginElement(key: string): void;
    endElement(): void;

    render(): void;

    readonly currentLayer: {
        bringToFront(): void;
    }

    readonly currentElement: Readonly<UiElement>;
    readonly drawContext: DrawAPI;
    readonly mouse: MouseAPI;
    readonly state: StateAPI;
    readonly layout: LayoutAPI;
    readonly focus: FocusAPI;
    readonly action: ActionAPI;
}

