import { Layer } from '../../../types';
import { LayerService } from './LayerService';

enum LayerServiceState {
    BUILD_MODE,
    RENDER_MODE,
}

export class LayerServiceImpl implements LayerService {
    private readonly layersSeenThisFrame: Set<Layer> = new Set();
    private readonly layerOrder: Layer[] = [];
    private readonly layerStack: Layer[] = [];
    private readonly moveToFrontRequests: Set<Layer> = new Set();
    private state: LayerServiceState = LayerServiceState.BUILD_MODE;

    constructor() {
        this.beginLayer = this.beginLayer.bind(this);
        this.endLayer = this.endLayer.bind(this);
        this.getCurrentLayer = this.getCurrentLayer.bind(this);
        this.getOrderedLayers = this.getOrderedLayers.bind(this);
        this.bringToFront = this.bringToFront.bind(this);
        this.onPreRender = this.onPreRender.bind(this);
        this.onPostRender = this.onPostRender.bind(this);
        this.createLayer = this.createLayer.bind(this);
        this.compareLayersForSorting = this.compareLayersForSorting.bind(this);
    }

    beginLayer(key: string): void {
        if (this.state !== LayerServiceState.BUILD_MODE) {
            throw new Error('do not call beginLayer while in render mode');
        }

        const { layerStack, layerOrder } = this;
        const existingLayer = layerOrder.find((layer) => layer.key === key);

        if (existingLayer) {
            layerStack.push(existingLayer);
            this.layersSeenThisFrame.add(existingLayer);
        } else {
            const layer = this.createLayer(key);
            layerStack.push(layer);
            layerOrder.push(layer);
            this.layersSeenThisFrame.add(layer);
        }
    }

    endLayer(): void {
        if (this.state !== LayerServiceState.BUILD_MODE) {
            throw new Error('do not call endLayer while in render mode');
        }

        const poppedLayer = this.layerStack.pop();
        if (!poppedLayer) {
            throw new Error('No layer currently pushed');
        }
    }

    getCurrentLayer(): Layer | undefined {
        const { layerStack } = this;
        return layerStack[layerStack.length - 1];
    }

    getOrderedLayers(): Layer[] {
        if (this.state === LayerServiceState.BUILD_MODE) {
            throw new Error('Cannot return ordered layers while in build mode. Do not call getOrderedLayers() before calling onPreRender() or after onPostRender().');
        }
        return this.layerOrder;
    }

    bringToFront(): void {
        const { layerStack } = this;
        const layer = layerStack[layerStack.length - 1];
        if (!layer) {
            throw new Error('No layer currently active. Ensure #bringCurrentLayerToFront is only called between matching beginLayer and endLayer calls.');
        }
        this.moveToFrontRequests.add(layer);
    }

    onPreRender(): void {
        const { layersSeenThisFrame, layerOrder } = this;

        if (this.layerStack.length !== 0) {
            throw new Error('do not call onPreRender before ending every layer');
        }

        // clear layers we haven't seen this frame
        let nLayersNotSeen = 0;
        for (let i = 0; i < layerOrder.length; i++) {
            if (!layersSeenThisFrame.has(layerOrder[i])) {
                delete layerOrder[i];
                nLayersNotSeen++;
            }
        }
        layersSeenThisFrame.clear();

        // sort layers
        layerOrder.sort(this.compareLayersForSorting);
        layerOrder.length -= nLayersNotSeen;
        this.moveToFrontRequests.clear();

        for (let i = 0; i < layerOrder.length; i++) {
            layerOrder[i].zIndex = i;
        }

        this.state = LayerServiceState.RENDER_MODE;
    }

    onPostRender(): void {
        this.state = LayerServiceState.BUILD_MODE;
    }

    private createLayer(key: string) {
        return {
            key,
            zIndex: -1,
        }
    }

    private compareLayersForSorting(a: Layer, b: Layer): number {
        const aToFront = this.moveToFrontRequests.has(a);
        const bToFront = this.moveToFrontRequests.has(b);

        if (aToFront && bToFront) {
            return 0;
        } else if (aToFront) {
            return 1;
        } else if (bToFront) {
            return -1;
        } else {
            return 0;
        }
    }
}

