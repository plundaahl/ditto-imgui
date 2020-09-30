import { Layer, UiElement } from '../../types';

export interface ElementBuilder {
    setCurrentLayer(layer?: Layer): void;
    beginElement(key: string): void;
    getCurrentElement(): UiElement | undefined;
    endElement(): void;
    onPostRender(): void;
}

