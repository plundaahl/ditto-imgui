import { Layer, UiElement } from '../types';
import { DrawAPI, DrawCPI } from './DrawService';
import { MouseAPI, MouseCPI } from './MouseService';
import { StateAPI, StateCPI } from './StateService';
import { LayoutAPI, LayoutCPI } from './LayoutService';
import { FocusAPI, FocusCPI } from './FocusService';
import { KeyboardAPI, KeyboardCPI, KeyboardService } from './KeyboardService';
import { BoundsService, BoundsServiceAPI, BoundsServiceCPI } from './BoundsService';

export interface ServiceCPI {
    readonly mouse: MouseCPI;
    readonly focus: FocusCPI;
    readonly keyboard: KeyboardCPI;
    readonly bounds: BoundsServiceCPI;
}

export interface ServiceAPI {
    readonly draw: DrawAPI;
    readonly mouse: MouseAPI;
    readonly state: StateAPI;
    readonly layout: LayoutAPI;
    readonly focus: FocusAPI;
    readonly keyboard: KeyboardAPI;
    readonly bounds: BoundsServiceAPI;
}

export interface ServiceManager extends ServiceCPI, ServiceAPI {
    beginLayer(layer: Layer): void;
    endLayer(): void;
    beginElement(element: UiElement): void;
    endElement(): void;
    preRender(frameTimeInMs: number): void;
    postRender(frameTimeInMs: number): void;
    readonly draw: DrawAPI & DrawCPI;
    readonly mouse: MouseAPI & MouseCPI;
    readonly state: StateAPI & StateCPI;
    readonly layout: LayoutAPI & LayoutCPI;
    readonly focus: FocusAPI & FocusCPI;
    readonly keyboard: KeyboardService;
    readonly bounds: BoundsService;
}

