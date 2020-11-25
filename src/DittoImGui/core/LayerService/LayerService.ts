import { Layer } from '../../types';

export interface LayerAPI {
    bringLayerToFront(): void;
}

export interface LayerCPI {}

export interface LayerService extends LayerAPI, LayerCPI {
    beginLayer(key: string): void;
    endLayer(): void;
    getCurrentLayer(): Layer | undefined;
    getOrderedLayers(): Layer[];
    onPreRender(): void;
    onPostRender(): void;
}

