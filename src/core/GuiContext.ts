import { UiElement } from "./types";
import { DrawAPI } from './systems/DrawHandler';
import { MouseAPI } from './systems/MouseHandler';

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
}

