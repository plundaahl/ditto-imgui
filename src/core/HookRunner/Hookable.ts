import { Layer, UiElement } from '../types';

export interface Hookable {
    onBeginElement?(element: UiElement): void;
    onEndElement?(): void;
    onBeginLayer?(layer: Layer): void;
    onEndLayer?(): void;
    onPreRender?(): void;
    onPostRender?(): void;
}
