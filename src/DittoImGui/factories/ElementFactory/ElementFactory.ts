import { UiElement, Layer } from "../../types";

export interface ElementFactory {
    createElement(): UiElement;
    resetElement(element: UiElement): void;
}

