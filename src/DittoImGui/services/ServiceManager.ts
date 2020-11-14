import { UiElement } from "../types";
import { DrawAPI, DrawCPI } from './DrawService';
import { MouseAPI, MouseCPI } from './MouseService';
import { StateAPI, StateCPI } from './StateService';
import { LayoutAPI, LayoutCPI } from './LayoutService';
import { FocusAPI, FocusCPI } from './FocusService';
import { ControllerAPI } from './ControllerService';
import { LayerAPI } from './LayerService';
import { KeyboardAPI, KeyboardCPI, KeyboardService } from './KeyboardService';

export interface ServiceCPI {
    readonly element: Readonly<UiElement>;
    readonly mouse: MouseCPI;
    readonly focus: FocusCPI;
    readonly keyboard: KeyboardCPI;
}

export interface ServiceAPI {
    readonly layer: LayerAPI;
    readonly element: Readonly<UiElement>;
    readonly draw: DrawAPI;
    readonly mouse: MouseAPI;
    readonly state: StateAPI;
    readonly layout: LayoutAPI;
    readonly focus: FocusAPI;
    readonly keyboard: KeyboardAPI;
    readonly controller: ControllerAPI;
}

export interface ServiceManager extends ServiceCPI, ServiceAPI {
    beginLayer(key: string): void;
    endLayer(): void;
    beginElement(key: string): void;
    endElement(): void;
    render(frameTimeInMs: number): void;
    readonly element: Readonly<UiElement>;
    readonly draw: DrawAPI & DrawCPI;
    readonly mouse: MouseAPI & MouseCPI;
    readonly state: StateAPI & StateCPI;
    readonly layout: LayoutAPI & LayoutCPI;
    readonly focus: FocusAPI & FocusCPI;
    readonly keyboard: KeyboardService;
}

