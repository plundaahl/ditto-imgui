import { Layer } from '../types';

export interface LayerService {
    getCurrentLayer(): Layer;
    getLayerOrder(): readonly Layer[];
}

export interface LayerServiceSPI {
    setCurrentLayer(element: Layer): void;
    setLayerOrder(layerOrder: readonly Layer[]): void;
}

export class LayerServiceImpl implements LayerService, LayerServiceSPI {
    private currentLayer: Layer;
    private layerOrder: readonly Layer[];

    getCurrentLayer(): Layer {
        return this.currentLayer;
    }

    setCurrentLayer(element: Layer): void {
        this.currentLayer = element;
    }

    setLayerOrder(layerOrder: Layer[]): void {
        this.layerOrder = layerOrder;
    }

    getLayerOrder(): readonly Layer[] {
        return this.layerOrder || [];
    }
}

