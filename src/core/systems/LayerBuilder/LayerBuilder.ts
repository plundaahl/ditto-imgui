import { Layer } from '../../types';

export interface LayerBuilder {
    beginLayer(key: string): void;
    endLayer(): void;
    getCurrentLayer(): Layer;
    getOrderedLayers(): Layer[];
    bringCurrentLayerToFront(): void;
    onPreRender(): void;
    onPostRender(): void;
}

