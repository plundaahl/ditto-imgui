import { UiElement } from "./types";

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
}

