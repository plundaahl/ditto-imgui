import { ControllerManager } from './ControllerManager';
import { ControllerFactory } from './ControllerFactory';
import { Controller } from './Controller';
import { ServiceCPI } from '../services';

type HookListener<T extends keyof Controller> = Required<Pick<Controller, T>>;

export class ControllerManagerImpl implements ControllerManager {
    private readonly controllers: Controller[];
    private readonly onBeginElementListeners: HookListener<'onBeginElement'>[] = [];
    private readonly onEndElementListeners: HookListener<'onEndElement'>[] = [];
    private readonly onBeginLayerListeners: HookListener<'onBeginLayer'>[] = [];
    private readonly onEndLayerListeners: HookListener<'onEndLayer'>[] = [];
    private readonly onPreRenderListeners: HookListener<'onPreRender'>[] = [];
    private readonly onPostRenderListeners: HookListener<'onPostRender'>[] = [];

    constructor(
        serviceManager: ServiceCPI,
        ...controllerFactories: ControllerFactory[]
    ) {
        this.isElementHighlighted = this.isElementHighlighted.bind(this);
        this.isElementReadied = this.isElementReadied.bind(this);
        this.isElementTriggered = this.isElementTriggered.bind(this);
        this.isElementToggled = this.isElementToggled.bind(this);
        this.isElementQueried = this.isElementQueried.bind(this);
        this.isElementDragged = this.isElementDragged.bind(this);
        this.isElementInteracted = this.isElementInteracted.bind(this);
        this.isChildInteracted = this.isChildInteracted.bind(this);
        this.getDragX = this.getDragX.bind(this);
        this.getDragY = this.getDragY.bind(this);

        this.controllers = controllerFactories.map(
            fact => fact.createController(serviceManager),
        );

        for (const controller of this.controllers) {
            if (controller.onBeginLayer) {
                this.onBeginLayerListeners.push(controller as any);
            }

            if (controller.onEndLayer) {
                this.onEndLayerListeners.push(controller as any);
            }

            if (controller.onBeginElement) {
                this.onBeginElementListeners.push(controller as any);
            }

            if (controller.onEndElement) {
                this.onEndElementListeners.push(controller as any);
            }

            if (controller.onPreRender) {
                this.onPreRenderListeners.push(controller as any);
            }

            if (controller.onPostRender) {
                this.onPostRenderListeners.push(controller as any);
            }
        }
    }

    onBeginLayer(): void {
        for (const listener of this.onBeginLayerListeners) {
            listener.onBeginLayer();
        }
    }

    onEndLayer(): void {
        for (const listener of this.onEndLayerListeners) {
            listener.onEndLayer();
        }
    }

    onBeginElement(): void {
        for (const listener of this.onBeginElementListeners) {
            listener.onBeginElement();
        }
    }

    onEndElement(): void {
        for (const listener of this.onEndElementListeners) {
            listener.onEndElement();
        }
    }

    onPreRender(): void {
        for (const listener of this.onPreRenderListeners) {
            listener.onPreRender();
        }
    }

    onPostRender(): void {
        for (const listener of this.onPostRenderListeners) {
            listener.onPostRender();
        }
    }

    isElementHighlighted(): boolean {
        for (const provider of this.controllers) {
            if (provider.isElementHighlighted()) {
                return true;
            }
        }
        return false;
    }

    isElementReadied(): boolean {
        for (const provider of this.controllers) {
            if (provider.isElementReadied()) {
                return true;
            }
        }
        return false;
    }

    isElementTriggered(): boolean {
        for (const provider of this.controllers) {
            if (provider.isElementTriggered()) {
                return true;
            }
        }
        return false;
    }

    isElementToggled(): boolean {
        for (const provider of this.controllers) {
            if (provider.isElementToggled()) {
                return true;
            }
        }
        return false;
    }

    isElementQueried(): boolean {
        for (const provider of this.controllers) {
            if (provider.isElementQueried()) {
                return true;
            }
        }
        return false;
    }

    isElementDragged(): boolean {
        for (const provider of this.controllers) {
            if (provider.isElementDragged()) {
                return true;
            }
        }
        return false;
    }

    isElementInteracted(): boolean {
        for (const provider of this.controllers) {
            if (provider.isElementInteracted()) {
                return true;
            }
        }
        return false;
    }

    isChildInteracted(): boolean {
        for (const provider of this.controllers) {
            if (provider.isChildInteracted()) {
                return true;
            }
        }
        return false;
    }

    isFloatingChildInteracted(): boolean {
        for (const provider of this.controllers) {
            if (provider.isFloatingChildInteracted()) {
                return true;
            }
        }
        return false;
    }

    getDragX(): number {
        const provider = this.controllers.find(provider => provider.isElementDragged());
        return provider
            ? provider.getDragX()
            : 0;
    }

    getDragY(): number {
        const provider = this.controllers.find(provider => provider.isElementDragged());
        return provider
            ? provider.getDragY()
            : 0;
    }
}
