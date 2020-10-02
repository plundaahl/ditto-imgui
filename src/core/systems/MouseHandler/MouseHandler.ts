import { UiElement } from "../../types";

export interface MouseAPI {
    readonly dragX: number;
    readonly dragY: number;
    hoversElement(): boolean;
    hoversChild(): boolean;
    hoversFloatingChild(): boolean;
    isM1Down(): boolean;
    isM2Down(): boolean;
    isM1Clicked(): boolean;
    isM1DoubleClicked(): boolean;
    isM1Dragged(): boolean;
    isM2Clicked(): boolean;
}

export interface MouseHandler extends MouseAPI {
    onBeginElement(element: UiElement): void;
    onEndElement(): void;
    onLayersSorted(): void;
}

