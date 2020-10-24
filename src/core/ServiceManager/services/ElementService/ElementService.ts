import { Layer, UiElement } from '../../../types';

export interface ElementAPI {
    beginElement(key: string): void;
    endElement(): void;
}

export interface ElementCPI {}

export interface ElementService extends ElementAPI {
    setCurrentLayer(layer?: Layer): void;
    getCurrentElement(): UiElement | undefined;
    onPostRender(): void;
}
