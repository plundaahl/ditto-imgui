import { UiElement, Layer } from "../types";
import { LayerAPI } from './LayerService';

export interface CoreCPI {
    readonly element: Readonly<UiElement>;
}

export interface CoreAPI {
    readonly layer: LayerAPI;
    readonly element: Readonly<UiElement>;
}

export interface Core extends CoreCPI, CoreAPI {
    beginLayer(key: string, flags: number): void;
    endLayer(): void;
    beginElement(key: string, flags: number): void;
    endElement(): void;
    preRender(): void;
    render(): void;
    postRender(): void;
    readonly element: Readonly<UiElement>;
    readonly curLayer: Readonly<Layer>;
}

