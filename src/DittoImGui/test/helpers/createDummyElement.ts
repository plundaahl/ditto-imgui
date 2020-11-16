import { UiElement, Layer } from '../../types';

let defaultLayer: Layer = { key: 'def', zIndex: 0 };

export function createDummyElement(e: Partial<UiElement> = {}): UiElement {
    return {
        key: 'foo',
        layer: defaultLayer,
        bounds: { x: 0, y: 0, h: 0, w: 0 },
        parent: undefined,
        drawBuffer: [],
        children: [],
        flags: 0,
        ...e,
    };
}
