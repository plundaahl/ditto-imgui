import { Layer } from "../types";
import { LayerAPI } from './LayerService';
import { ElementAPI, ElementService } from './ElementService';
import { KeyAPI, KeyService } from './KeyService';

interface CoreShared {}

export interface CoreCPI extends CoreShared {
    readonly element: ElementAPI;
}

export interface CoreAPI extends CoreShared {
    readonly layer: LayerAPI;
    readonly key: KeyAPI;
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
    readonly key: Readonly<KeyService>;
}

