import { DittoContext } from './DittoContext';
import { InfraContainer } from './infrastructure';
import { Core } from './core';
import { ElementAPI } from './core/ElementService';
import { ServiceManager } from './services';
import { ControllerManager } from './controllers';
import { DrawAPI } from './services/DrawService';
import { FocusAPI } from './services/FocusService';
import { LayerAPI } from './core/LayerService';
import { LayoutAPI } from './services/LayoutService';
import { MouseAPI } from './services/MouseService';
import { StateAPI } from './services/StateService';
import { BoundsServiceAPI } from './services/BoundsService';
import { KeyboardAPI } from './services/KeyboardService';
import { ControllerAPI } from './controllers';

export class DittoContextImpl implements DittoContext {
    constructor(
        private readonly infraContainer: InfraContainer,
        private readonly core: Core,
        private readonly serviceManager: ServiceManager,
        private readonly controllerManager: ControllerManager,
    ) {
        this.beginLayer = this.beginLayer.bind(this);
        this.endLayer = this.endLayer.bind(this);
        this.beginElement = this.beginElement.bind(this);
        this.endElement = this.endElement.bind(this);
        this.render = this.render.bind(this);

        this.element = core.element;
        this.layer = core.layer;

        this.draw = serviceManager.draw;
        this.mouse = serviceManager.mouse;
        this.state = serviceManager.state;
        this.layout = serviceManager.layout;
        this.focus = serviceManager.focus;
        this.keyboard = serviceManager.keyboard;
        this.bounds = serviceManager.bounds;

        this.controller = controllerManager;
    }

    beginLayer(key: string, flags: number = 0): void {
        this.core.beginLayer(key, flags);
        this.serviceManager.beginLayer(this.core.curLayer);
        this.controllerManager.onBeginLayer();
    }

    endLayer(): void {
        this.core.endLayer();
        this.serviceManager.endLayer();
        this.controllerManager.onEndLayer();
    }

    beginElement(key: string, flags: number = 0): void {
        this.core.beginElement(key, flags);
        const curElement = this.core.element.getCurrentElement();
        if (!curElement) {
            throw new Error('should not happen');
        }
        this.serviceManager.beginElement(curElement);
        this.controllerManager.onBeginElement();
    }

    endElement(): void {
        this.core.endElement();
        this.serviceManager.endElement();
        this.controllerManager.onEndElement();
    }

    render(): void {
        this.infraContainer.onPreRender();
        const frameTime = this.infraContainer.frameTimeTracker.getFrameDeltaTime();

        this.core.preRender();
        this.serviceManager.preRender(frameTime);
        this.controllerManager.onPreRender();

        this.core.render();

        this.core.postRender();
        this.serviceManager.postRender(frameTime);
        this.controllerManager.onPostRender();
    }

    element: ElementAPI;
    controller: ControllerAPI;
    layer: LayerAPI;
    draw: DrawAPI;
    mouse: MouseAPI;
    state: StateAPI;
    layout: LayoutAPI;
    focus: FocusAPI;
    keyboard: KeyboardAPI;
    bounds: BoundsServiceAPI;
}
