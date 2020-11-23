import { Layer, UiElement, Box } from '../../types';

export interface ElementAPI {
    getBounds(): Box;
}

export interface ElementCPI {}

export interface ElementService extends ElementAPI {
    beginElement(key: string, flags: number): void;
    endElement(): void;
    setCurrentLayer(layer?: Layer): void;
    getCurrentElement(): UiElement | undefined;
    onPostRender(): void;
}

