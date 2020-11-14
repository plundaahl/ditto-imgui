import { UiElement } from '../../types';

export interface LayoutFunction {
    (parent: UiElement): void
}

export interface LayoutAPI {
    setLayout(layoutFunction: LayoutFunction): void;
}

export interface LayoutCPI {}

export interface LayoutService extends LayoutAPI, LayoutCPI {
    onBeginElement(element: UiElement): void;
    onEndElement(): void;
    onPostRender(): void;
}

