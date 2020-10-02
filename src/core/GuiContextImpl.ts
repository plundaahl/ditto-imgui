import { UiElement, Layer } from './types';
import { GuiContext } from './GuiContext';
import { KeyBuilder } from './systems/KeyBuilder';
import { Renderer } from './systems/Renderer';
import { DrawHandler, DrawAPI } from './systems/DrawHandler';
import { LayerBuilder } from './systems/LayerBuilder';
import { ElementBuilder } from './systems/ElementBuilder';
import { MouseAPI, MouseHandler } from './systems/MouseHandler';
import { StateAPI, StateManager } from './systems/StateManager';

export class GuiContextImpl implements GuiContext {

    constructor(
        private readonly keyBuilder: KeyBuilder,
        private readonly elementBuilder: ElementBuilder,
        private readonly layerBuilder: LayerBuilder,
        private readonly drawHandler: DrawHandler,
        private readonly renderer: Renderer,
        private readonly mouseHandler: MouseHandler,
        private readonly stateManager: StateManager,
    ) {

        this.beginLayer = this.beginLayer.bind(this);
        this.endLayer = this.endLayer.bind(this);
        this.beginElement = this.beginElement.bind(this);
        this.endElement = this.endElement.bind(this);
        this.render = this.render.bind(this);

        this.currentLayer = {
            bringToFront: layerBuilder.bringCurrentLayerToFront,
        };

        this.drawContext = drawHandler;
        this.mouse = mouseHandler;
        this.state = stateManager;
    }

    readonly currentLayer: {
        bringToFront: () => void;
    }

    get currentElement(): Readonly<UiElement> {
        const element = this.elementBuilder.getCurrentElement();
        if (element === undefined) {
            throw new Error('no element is currently on stack');
        }
        return element;
    }

    readonly drawContext: DrawAPI;
    readonly mouse: MouseAPI;
    readonly state: StateAPI;

    beginLayer(key: string): void {
        const { keyBuilder, layerBuilder, elementBuilder } = this;

        keyBuilder.push(key);
        const qualifiedKey = keyBuilder.getCurrentQualifiedKey();
        this.stateManager.onBeginKey(qualifiedKey);

        layerBuilder.beginLayer(qualifiedKey);
        const layer = layerBuilder.getCurrentLayer() as Layer;

        elementBuilder.setCurrentLayer(layer);
        elementBuilder.beginElement(qualifiedKey);
        const rootElement = elementBuilder.getCurrentElement() as UiElement;

        layer.rootElement = rootElement;
        this.drawHandler.setCurrentElement(rootElement);
        this.mouseHandler.onBeginElement(rootElement);
    }

    endLayer(): void {
        const { elementBuilder, layerBuilder } = this;
        elementBuilder.endElement();
        layerBuilder.endLayer();
        this.keyBuilder.pop();
        this.stateManager.onEndKey();

        elementBuilder.setCurrentLayer(layerBuilder.getCurrentLayer());
        this.drawHandler.setCurrentElement(elementBuilder.getCurrentElement());
        this.mouseHandler.onEndElement();
    }

    beginElement(key: string): void {
        const { keyBuilder, elementBuilder } = this;

        keyBuilder.push(key);
        const qualifiedKey = keyBuilder.getCurrentQualifiedKey();
        this.stateManager.onBeginKey(qualifiedKey);

        elementBuilder.beginElement(qualifiedKey);
        const curElement = elementBuilder.getCurrentElement();

        this.drawHandler.setCurrentElement(curElement);
        this.mouseHandler.onBeginElement(curElement as UiElement);
    }

    endElement(): void {
        const { elementBuilder } = this;
        const element = elementBuilder.getCurrentElement();
        if (element && !element.parent) {
            throw new Error('Attempting to remove an element, but there are no more non-root elements left on the current layer.');
        }

        elementBuilder.endElement();
        this.keyBuilder.pop();
        this.stateManager.onEndKey();
        this.drawHandler.setCurrentElement(elementBuilder.getCurrentElement());
        this.mouseHandler.onEndElement();
    }

    render(): void {
        this.layerBuilder.onPreRender();
        this.mouseHandler.onLayersSorted();

        this.renderer.render(this.layerBuilder.getOrderedLayers());

        this.layerBuilder.onPostRender();
        this.elementBuilder.onPostRender();
    }
}

