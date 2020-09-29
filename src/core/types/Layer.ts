import { UiElement } from './UiElement';

export interface Layer {
    key: string,
    zIndex: number,
    rootElement?: UiElement,
}

