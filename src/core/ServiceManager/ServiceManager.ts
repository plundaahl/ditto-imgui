import { UiElement } from "../types";
import { DrawAPI, DrawCPI } from './services/DrawService';
import { MouseAPI, MouseCPI } from './services/MouseService';
import { StateAPI, StateCPI } from './services/StateService';
import { LayoutAPI, LayoutCPI } from './services/LayoutService';
import { FocusAPI, FocusCPI } from './services/FocusService';
import { LayerAPI } from './services/LayerService';

export interface ServiceCPI {
    readonly element: Readonly<UiElement>;
    readonly mouse: MouseCPI;
    readonly focus: FocusCPI;
}

export interface ServiceAPI {
    beginLayer(key: string): void;
    endLayer(): void;
    beginElement(key: string): void;
    endElement(): void;
    render(): void;
    readonly layer: LayerAPI;
    readonly element: Readonly<UiElement>;
    readonly draw: DrawAPI;
    readonly mouse: MouseAPI;
    readonly state: StateAPI;
    readonly layout: LayoutAPI;
    readonly focus: FocusAPI;
}

export interface ServiceManager extends ServiceCPI, ServiceAPI {
    readonly element: Readonly<UiElement>;
    readonly draw: DrawAPI & DrawCPI;
    readonly mouse: MouseAPI & MouseCPI;
    readonly state: StateAPI & StateCPI;
    readonly layout: LayoutAPI & LayoutCPI;
    readonly focus: FocusAPI & FocusCPI;
}

