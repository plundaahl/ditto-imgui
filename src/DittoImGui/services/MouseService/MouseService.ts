import { UiElement } from '../../types';

export interface MouseAPI {
    getMouseX(): number;
    getMouseY(): number;
    getDragX(): number;
    getDragY(): number;
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

export interface MouseCPI extends MouseAPI {
}

export interface MouseService extends MouseAPI, MouseCPI {
    onBeginElement(element: UiElement): void;
    onEndElement(): void;
    onPreRender(): void;
}

