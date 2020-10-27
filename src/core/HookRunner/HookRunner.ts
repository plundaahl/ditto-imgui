import { Layer, UiElement } from '../types';
import { Hookable } from './Hookable';

export interface HookRunner {
    registerHookable(hookable: Hookable): void;
    runOnBeginElementHook(element: UiElement): void;
    runOnEndElementHook(): void;
    runOnBeginLayerHook(layer: Layer): void;
    runOnEndLayerHook(): void;
    runOnPreRenderHook(): void;
    runOnPostRenderHook(): void;
}
