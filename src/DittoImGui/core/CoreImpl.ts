import { UiElement, Layer } from '../types';
import { Core } from './Core';
import { KeyService } from './KeyService';
import { RenderService } from './RenderService';
import { LayerService } from './LayerService';
import { ElementService } from './ElementService';

export class CoreImpl implements Core {

    constructor(
        private readonly keyBuilder: KeyService,
        private readonly elementBuilder: ElementService,
        private readonly layerBuilder: LayerService,
        private readonly renderer: RenderService,
    ) {

        this.beginLayer = this.beginLayer.bind(this);
        this.endLayer = this.endLayer.bind(this);
        this.beginElement = this.beginElement.bind(this);
        this.endElement = this.endElement.bind(this);
        this.render = this.render.bind(this);

        this.element = elementBuilder;
        this.layer = layerBuilder;
        this.key = keyBuilder;
    }

    readonly element: ElementService;
    readonly layer: LayerService;
    readonly key: KeyService;

    get curLayer(): Readonly<Layer> {
        const layer = this.layerBuilder.getCurrentLayer();
        if (!layer) {
            throw new Error('no layer is currently on stack');
        }
        return layer;
    }

    beginLayer(key: string, flags: number): void {
        const { keyBuilder, layerBuilder, elementBuilder } = this;

        keyBuilder.push(key);
        const qualifiedKey = keyBuilder.getCurrentQualifiedKey();

        layerBuilder.beginLayer(qualifiedKey);
        const layer = layerBuilder.getCurrentLayer() as Layer;

        elementBuilder.setCurrentLayer(layer);
        elementBuilder.beginElement(qualifiedKey, flags);
        const rootElement = elementBuilder.getCurrentElement() as UiElement;

        layer.rootElement = rootElement;
    }

    endLayer(): void {
        const { elementBuilder, layerBuilder } = this;
        elementBuilder.endElement();
        layerBuilder.endLayer();
        this.keyBuilder.pop();

        elementBuilder.setCurrentLayer(layerBuilder.getCurrentLayer());
    }

    beginElement(key: string, flags: number): void {
        const { keyBuilder, elementBuilder } = this;

        keyBuilder.push(key);
        const qualifiedKey = keyBuilder.getCurrentQualifiedKey();

        elementBuilder.beginElement(qualifiedKey, flags);
    }

    endElement(): void {
        const { elementBuilder } = this;
        const element = elementBuilder.getCurrentElement();
        if (element && !element.parent) {
            throw new Error('Attempting to remove an element, but there are no more non-root elements left on the current layer.');
        }

        elementBuilder.endElement();
        this.keyBuilder.pop();
    }

    preRender(): void {
        this.layerBuilder.onPreRender();
    }

    render(): void {
        this.renderer.render(this.layerBuilder.getOrderedLayers());
    }

    postRender(): void {
        this.layerBuilder.onPostRender();
        this.elementBuilder.onPostRender();
    }
}

