import { DittoContext } from './DittoContext';
import { InfraContainer } from './infrastructure';
import { Core } from './core';
import { ServiceManager } from './services';
import { DrawAPI } from './services/DrawService';
import { FocusAPI } from './services/FocusService';
import { LayerAPI } from './core/LayerService';
import { LayoutAPI } from './services/LayoutService';
import { MouseAPI } from './services/MouseService';
import { StateAPI } from './services/StateService';
import { UiElement } from './types';
import { KeyboardAPI } from './services/KeyboardService';
import { ControllerAPI } from './services/ControllerService';

export class DittoContextImpl implements DittoContext {
    constructor(
        private readonly infraContainer: InfraContainer,
        private readonly core: Core,
        private readonly serviceManager: ServiceManager,
    ) {
        this.beginLayer = this.beginLayer.bind(this);
        this.endLayer = this.endLayer.bind(this);
        this.beginElement = this.beginElement.bind(this);
        this.endElement = this.endElement.bind(this);
        this.render = this.render.bind(this);

        this.layer = core.layer;
        this.draw = serviceManager.draw;
        this.mouse = serviceManager.mouse;
        this.state = serviceManager.state;
        this.layout = serviceManager.layout;
        this.focus = serviceManager.focus;
        this.keyboard = serviceManager.keyboard;
        this.controller = serviceManager.controller;
    }

    beginLayer(key: string): void {
        this.core.beginLayer(key);
        this.serviceManager.beginLayer(this.core.curLayer);
    }

    endLayer(): void {
        this.core.endLayer();
        this.serviceManager.endLayer();
    }

    beginElement(key: string): void {
        this.core.beginElement(key);
        this.serviceManager.beginElement(this.core.element);
    }

    endElement(): void {
        this.core.endElement();
        this.serviceManager.endElement();
    }

    render(): void {
        this.infraContainer.onPreRender();
        this.core.preRender();

        const frameTime = this.infraContainer.frameTimeTracker.getFrameDeltaTime();
        this.serviceManager.preRender(frameTime);

        this.core.render();

        this.core.postRender();
        this.serviceManager.postRender(frameTime);
    }

    get element(): Readonly<UiElement> {
        return this.core.element;
    }

    controller: ControllerAPI;
    layer: LayerAPI;
    draw: DrawAPI;
    mouse: MouseAPI;
    state: StateAPI;
    layout: LayoutAPI;
    focus: FocusAPI;
    keyboard: KeyboardAPI;
}
