import { DittoContext } from './DittoContext';
import { ServiceManager } from './ServiceManager';
import { ControllerAPI, ControllerManager } from './ControllerManager';
import { DrawAPI } from './ServiceManager/services/DrawService';
import { FocusAPI } from './ServiceManager/services/FocusService';
import { LayerAPI } from './ServiceManager/services/LayerService';
import { LayoutAPI } from './ServiceManager/services/LayoutService';
import { MouseAPI } from './ServiceManager/services/MouseService';
import { StateAPI } from './ServiceManager/services/StateService';
import { UiElement } from './types';

export class DittoContextImpl implements DittoContext {
    constructor(
        private readonly serviceManager: ServiceManager,
        controllerManager: ControllerManager,
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
        this.action = controllerManager;
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
        this.serviceManager.render();
    }

    get element(): Readonly<UiElement> {
        return this.serviceManager.element;
    }

    action: ControllerAPI;
    layer: LayerAPI;
    draw: DrawAPI;
    mouse: MouseAPI;
    state: StateAPI;
    layout: LayoutAPI;
    focus: FocusAPI;
}
