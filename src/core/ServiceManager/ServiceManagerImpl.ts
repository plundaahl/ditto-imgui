import { UiElement, Layer } from '../types';
import { ServiceManager } from './ServiceManager';
import { KeyService } from './services/KeyService';
import { RenderService } from './services/RenderService';
import { DrawService } from './services/DrawService';
import { LayerService } from './services/LayerService';
import { ElementService } from './services/ElementService';
import { MouseService } from './services/MouseService';
import { StateService } from './services/StateService';
import { LayoutService } from './services/LayoutService';
import { FocusService } from './services/FocusService';

export class ServiceManagerImpl implements ServiceManager {

    constructor(
        private readonly keyBuilder: KeyService,
        private readonly elementBuilder: ElementService,
        private readonly layerBuilder: LayerService,
        private readonly drawHandler: DrawService,
        private readonly renderer: RenderService,
        private readonly mouseHandler: MouseService,
        private readonly stateManager: StateService,
        private readonly layoutHandler: LayoutService,
        private readonly focusManager: FocusService,
    ) {

        this.beginLayer = this.beginLayer.bind(this);
        this.endLayer = this.endLayer.bind(this);
        this.beginElement = this.beginElement.bind(this);
        this.endElement = this.endElement.bind(this);
        this.render = this.render.bind(this);

        this.layer = layerBuilder;
        this.draw = drawHandler;
        this.mouse = mouseHandler;
        this.state = stateManager;
        this.layout = layoutHandler;
        this.focus = focusManager;
    }

    readonly layer: {
        bringToFront: () => void;
    }

    get element(): Readonly<UiElement> {
        const element = this.elementBuilder.getCurrentElement();
        if (element === undefined) {
            throw new Error('no element is currently on stack');
        }
        return element;
    }

    readonly draw: DrawService;
    readonly mouse: MouseService;
    readonly state: StateService;
    readonly layout: LayoutService;
    readonly focus: FocusService;

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
        this.layoutHandler.onBeginElement(rootElement);
        this.focusManager.onBeginElement(rootElement);
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
        this.layoutHandler.onEndElement();
        this.focusManager.onEndElement();
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
        this.layoutHandler.onBeginElement(curElement as UiElement);
        this.focusManager.onBeginElement(curElement as UiElement);
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
        this.layoutHandler.onEndElement();
        this.focusManager.onEndElement();
    }

    render(): void {
        this.layerBuilder.onPreRender();
        this.mouseHandler.onLayersSorted();
        this.focusManager.onPreRender();

        this.renderer.render(this.layerBuilder.getOrderedLayers());

        this.layerBuilder.onPostRender();
        this.elementBuilder.onPostRender();
        this.layoutHandler.onPostRender();
    }
}

