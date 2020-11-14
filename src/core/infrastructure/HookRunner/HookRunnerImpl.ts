import { HookRunner } from './HookRunner';
import { Hookable } from './Hookable';
import { UiElement, Layer } from '../../types';

export class HookRunnerImpl implements HookRunner {
    private readonly onBeginElementListeners: Required<Pick<Hookable, 'onBeginElement'>>[] = [];
    private readonly onEndElementListeners: Required<Pick<Hookable, 'onEndElement'>>[] = [];
    private readonly onBeginLayerListeners: Required<Pick<Hookable, 'onBeginLayer'>>[] = [];
    private readonly onEndLayerListeners: Required<Pick<Hookable, 'onEndLayer'>>[] = [];
    private readonly onPreRenderListeners: Required<Pick<Hookable, 'onPreRender'>>[] = [];
    private readonly onPostRenderListeners: Required<Pick<Hookable, 'onPostRender'>>[] = [];

    constructor() {
        this.registerHookable = this.registerHookable.bind(this);
        this.runOnBeginElementHook = this.runOnBeginElementHook.bind(this);
        this.runOnEndElementHook = this.runOnEndElementHook.bind(this);
        this.runOnBeginLayerHook = this.runOnBeginLayerHook.bind(this);
        this.runOnEndLayerHook = this.runOnEndLayerHook.bind(this);
        this.runOnPreRenderHook = this.runOnPreRenderHook.bind(this);
        this.runOnPostRenderHook = this.runOnPostRenderHook.bind(this);
    }

    registerHookable(hookable: Partial<Hookable>): void {
        hookable.onBeginElement && this.onBeginElementListeners.push(hookable as Required<Pick<Hookable, 'onBeginElement'>>);
        hookable.onEndElement && this.onEndElementListeners.push(hookable as Required<Pick<Hookable, 'onEndElement'>>);
        hookable.onBeginLayer && this.onBeginLayerListeners.push(hookable as Required<Pick<Hookable, 'onBeginLayer'>>);
        hookable.onEndLayer && this.onEndLayerListeners.push(hookable as Required<Pick<Hookable, 'onEndLayer'>>);
        hookable.onPreRender && this.onPreRenderListeners.push(hookable as Required<Pick<Hookable, 'onPreRender'>>);
        hookable.onPostRender && this.onPostRenderListeners.push(hookable as Required<Pick<Hookable, 'onPostRender'>>);
    }

    runOnBeginElementHook(element: UiElement): void {
        for (const listener of this.onBeginElementListeners) {
            listener.onBeginElement(element);
        }
    }

    runOnEndElementHook(): void {
        for (const listener of this.onEndElementListeners) {
            listener.onEndElement();
        }
    }

    runOnBeginLayerHook(layer: Layer): void {
        for (const listener of this.onBeginLayerListeners) {
            listener.onBeginLayer(layer);
        }
    }

    runOnEndLayerHook(): void {
        for (const listener of this.onEndLayerListeners) {
            listener.onEndLayer();
        }
    }

    runOnPreRenderHook(frameTimeInMs: number): void {
        for (const listener of this.onPreRenderListeners) {
            listener.onPreRender(frameTimeInMs);
        }
    }

    runOnPostRenderHook(frameTimeInMs: number): void {
        for (const listener of this.onPostRenderListeners) {
            listener.onPostRender(frameTimeInMs);
        }
    }
}

