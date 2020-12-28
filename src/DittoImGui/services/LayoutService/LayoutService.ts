import { UiElement } from '../../types';

export interface LayoutFunction {
    (): void
}

export interface LayoutAPI {
    addConstraints(...constraints: LayoutFunction[]): void;
    addChildConstraints(...constraints: LayoutFunction[]): void;
    addGlobalConstraints(...constraints: LayoutFunction[]): void;
    calculateLayout(): void;
}

export interface LayoutCPI {}

export interface LayoutService extends LayoutAPI, LayoutCPI {
    onBeginElement(element: UiElement): void;
    onEndElement(): void;
    onPostRender(): void;
}

