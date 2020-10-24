import { UiElement } from '../../../types';

interface FocusShared {
    isFocused(): boolean;
    focusElement(): void;
}

export interface FocusAPI extends FocusShared {
    setFocusable(): void;
}

export interface FocusCPI extends FocusShared {
    incrementFocus(): void;
    decrementFocus(): void;
}

export interface FocusService extends FocusAPI, FocusCPI {
    onBeginElement(element: UiElement): void;
    onEndElement(): void;
    onPostRender(): void;
    onWillRenderElement(element: UiElement, context: CanvasRenderingContext2D): void;
}

