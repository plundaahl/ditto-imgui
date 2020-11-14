import { DittoContext } from './DittoContext';
import { InfraContainer } from './infrastructure';
import { ServiceManager } from './services';
import { DrawAPI } from './services/DrawService';
import { FocusAPI } from './services/FocusService';
import { LayerAPI } from './services/LayerService';
import { LayoutAPI } from './services/LayoutService';
import { MouseAPI } from './services/MouseService';
import { StateAPI } from './services/StateService';
import { UiElement } from './types';
import { KeyboardAPI } from './services/KeyboardService';
import { ControllerAPI } from './services/ControllerService';

export class DittoContextImpl implements DittoContext {
    constructor(
        private readonly infraContainer: InfraContainer,
        private readonly serviceManager: ServiceManager,
    ) {
        this.beginLayer = this.beginLayer.bind(this);
        this.endLayer = this.endLayer.bind(this);
        this.beginElement = this.beginElement.bind(this);
        this.endElement = this.endElement.bind(this);
        this.render = this.render.bind(this);

        this.layer = serviceManager.layer;
        this.draw = serviceManager.draw;
        this.mouse = serviceManager.mouse;
        this.state = serviceManager.state;
        this.layout = serviceManager.layout;
        this.focus = serviceManager.focus;
        this.keyboard = serviceManager.keyboard;
        this.controller = serviceManager.controller;
    }

    beginLayer(key: string): void {
        this.serviceManager.beginLayer(key);
    }

    endLayer(): void {
        this.serviceManager.endLayer();
    }

    beginElement(key: string): void {
        this.serviceManager.beginElement(key);
    }

    endElement(): void {
        this.serviceManager.endElement();
    }

    render(): void {
        this.infraContainer.onPreRender();
        const frameTime = this.infraContainer.frameTimeTracker.getFrameDeltaTime();
        this.serviceManager.render(frameTime);
    }

    get element(): Readonly<UiElement> {
        return this.serviceManager.element;
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
