import { UiElement } from '../../types';

export interface FocusAPI {
    focusElement(): void;
    incrementFocus(): void;
    decrementFocus(): void;
    setFocusable(): void;
    isFocused(): boolean;
}

export interface FocusManager extends FocusAPI {
    onBeginElement(element: UiElement): void;
    onEndElement(): void;
    onPostRender(): void;
    onWillRenderElement(element: UiElement, context: CanvasRenderingContext2D): void;
}

