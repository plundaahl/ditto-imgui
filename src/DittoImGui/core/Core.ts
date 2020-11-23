import { Layer } from "../types";
import { LayerAPI } from './LayerService';
import { ElementAPI, ElementService } from './ElementService';

interface CoreShared {
    readonly element: ElementAPI;
}

export interface CoreCPI extends CoreShared {}

export interface CoreAPI extends CoreShared {
    readonly layer: LayerAPI;
}

export interface Core extends CoreCPI, CoreAPI {
    beginLayer(key: string, flags: number): void;
    endLayer(): void;
    beginElement(key: string, flags: number): void;
    endElement(): void;
    preRender(): void;
    render(): void;
    postRender(): void;
    readonly element: Readonly<ElementService>;
    readonly curLayer: Readonly<Layer>;
}

