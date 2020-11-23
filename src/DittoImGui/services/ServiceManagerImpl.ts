import { UiElement, Layer } from '../types';
import { HookRunner } from '../infrastructure/HookRunner';
import { ServiceManager } from './ServiceManager';
import { DrawService } from './DrawService';
import { MouseService } from './MouseService';
import { StateService } from './StateService';
import { LayoutService } from './LayoutService';
import { FocusService } from './FocusService';
import { KeyboardService } from './KeyboardService';
import { ChildBoundsService } from './ChildBoundsService';

export class ServiceManagerImpl implements ServiceManager {

    constructor(
        private readonly hookRunner: HookRunner,
        drawHandler: DrawService,
        mouseHandler: MouseService,
        stateManager: StateService,
        layoutHandler: LayoutService,
        focusManager: FocusService,
        keyboardService: KeyboardService,
        childBoundsService: ChildBoundsService,
    ) {

        this.beginLayer = this.beginLayer.bind(this);
        this.endLayer = this.endLayer.bind(this);
        this.beginElement = this.beginElement.bind(this);
        this.endElement = this.endElement.bind(this);
        this.preRender = this.preRender.bind(this);
        this.postRender = this.postRender.bind(this);

        this.draw = drawHandler;
        this.mouse = mouseHandler;
        this.state = stateManager;
        this.layout = layoutHandler;
        this.focus = focusManager;
        this.keyboard = keyboardService;
        this.childBounds = childBoundsService;

        hookRunner.registerHookable(stateManager);
        hookRunner.registerHookable(drawHandler);
        hookRunner.registerHookable(mouseHandler);
        hookRunner.registerHookable(layoutHandler);
        hookRunner.registerHookable(focusManager);
        hookRunner.registerHookable(keyboardService);
        hookRunner.registerHookable(childBoundsService);
    }

    readonly draw: DrawService;
    readonly mouse: MouseService;
    readonly state: StateService;
    readonly layout: LayoutService;
    readonly focus: FocusService;
    readonly keyboard: KeyboardService;
    readonly childBounds: ChildBoundsService;

    beginLayer(layer: Layer): void {
        const element = layer.rootElement;
        if (!element) {
            throw new Error('no rootElement for layer');
        }
        this.hookRunner.runOnBeginLayerHook(layer);
        this.hookRunner.runOnBeginElementHook(element);
    }

    endLayer(): void {
        this.hookRunner.runOnEndElementHook();
        this.hookRunner.runOnEndLayerHook();
    }

    beginElement(element: UiElement): void {
        this.hookRunner.runOnBeginElementHook(element);
    }

    endElement(): void {
        this.hookRunner.runOnEndElementHook();
    }

    preRender(frameTimeInMs: number): void {
        this.hookRunner.runOnPreRenderHook(frameTimeInMs);
    }

    postRender(frameTimeInMs: number): void {
        this.hookRunner.runOnPostRenderHook(frameTimeInMs);
    }
}

