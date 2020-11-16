import { UiElement } from '../../types';

interface FocusShared {
    isElementFocused(): boolean;
    isChildFocused(): boolean;
    isFloatingChildFocused(): boolean;
    didFocusChange(): boolean;
    focusElement(): void;
}

export interface FocusAPI extends FocusShared {
}

export interface FocusCPI extends FocusShared {
}

export interface FocusService extends FocusAPI, FocusCPI {
    onBeginElement(element: UiElement): void;
    onEndElement(): void;
    onPreRender(): void;
}

