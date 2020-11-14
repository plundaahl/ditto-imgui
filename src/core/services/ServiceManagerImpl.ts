import { UiElement, Layer } from '../types';
import { HookRunner } from '../HookRunner';
import { ServiceManager } from './ServiceManager';
import { FrameTimeTracker } from '../infrastructure/FrameTimeTracker';
import { KeyService } from './KeyService';
import { RenderService } from './RenderService';
import { DrawService } from './DrawService';
import { LayerService } from './LayerService';
import { ElementService } from './ElementService';
import { MouseService } from './MouseService';
import { StateService } from './StateService';
import { LayoutService } from './LayoutService';
import { FocusService } from './FocusService';
import { KeyboardService } from './KeyboardService';
import { ControllerService } from './ControllerService';

export class ServiceManagerImpl implements ServiceManager {

    constructor(
        private readonly hookRunner: HookRunner,
        private readonly frameTimeTracker: FrameTimeTracker,
        private readonly keyBuilder: KeyService,
        private readonly elementBuilder: ElementService,
        private readonly layerBuilder: LayerService,
        drawHandler: DrawService,
        private readonly renderer: RenderService,
        mouseHandler: MouseService,
        stateManager: StateService,
        layoutHandler: LayoutService,
        focusManager: FocusService,
        keyboardService: KeyboardService,
        controllerService: ControllerService,
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
        this.keyboard = keyboardService;
        this.controller = controllerService;

        hookRunner.registerHookable(stateManager);
        hookRunner.registerHookable(drawHandler);
        hookRunner.registerHookable(mouseHandler);
        hookRunner.registerHookable(layoutHandler);
        hookRunner.registerHookable(focusManager);
        hookRunner.registerHookable(keyboardService);
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
    readonly keyboard: KeyboardService;
    readonly controller: ControllerService;

    beginLayer(key: string): void {
        const { keyBuilder, layerBuilder, elementBuilder } = this;

        keyBuilder.push(key);
        const qualifiedKey = keyBuilder.getCurrentQualifiedKey();

        layerBuilder.beginLayer(qualifiedKey);
        const layer = layerBuilder.getCurrentLayer() as Layer;

        elementBuilder.setCurrentLayer(layer);
        elementBuilder.beginElement(qualifiedKey);
        const rootElement = elementBuilder.getCurrentElement() as UiElement;

        layer.rootElement = rootElement;

        this.hookRunner.runOnBeginLayerHook(layer);
        this.hookRunner.runOnBeginElementHook(rootElement);
    }

    endLayer(): void {
        const { elementBuilder, layerBuilder } = this;
        elementBuilder.endElement();
        layerBuilder.endLayer();
        this.keyBuilder.pop();

        elementBuilder.setCurrentLayer(layerBuilder.getCurrentLayer());

        this.hookRunner.runOnEndElementHook();
        this.hookRunner.runOnEndLayerHook();
    }

    beginElement(key: string): void {
        const { keyBuilder, elementBuilder } = this;

        keyBuilder.push(key);
        const qualifiedKey = keyBuilder.getCurrentQualifiedKey();

        elementBuilder.beginElement(qualifiedKey);
        const curElement = elementBuilder.getCurrentElement();

        this.hookRunner.runOnBeginElementHook(curElement as UiElement);
    }

    endElement(): void {
        const { elementBuilder } = this;
        const element = elementBuilder.getCurrentElement();
        if (element && !element.parent) {
            throw new Error('Attempting to remove an element, but there are no more non-root elements left on the current layer.');
        }

        elementBuilder.endElement();
        this.keyBuilder.pop();

        this.hookRunner.runOnEndElementHook();
    }

    render(): void {
        this.frameTimeTracker.advanceFrame();
        const frameTime = this.frameTimeTracker.getFrameDeltaTime();

        this.layerBuilder.onPreRender();

        this.hookRunner.runOnPreRenderHook(frameTime);
        this.renderer.render(this.layerBuilder.getOrderedLayers());

        this.layerBuilder.onPostRender();
        this.elementBuilder.onPostRender();
        this.hookRunner.runOnPostRenderHook(frameTime);
    }
}

