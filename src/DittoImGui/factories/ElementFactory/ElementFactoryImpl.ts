import { UiElement, Layer } from "../../types";
import { ElementFactory } from './ElementFactory';

export class ElementFactoryImpl implements ElementFactory {
    constructor(
        private readonly defaultLayer: Layer,
    ) {
        this.createElement = this.createElement.bind(this);
        this.resetElement = this.resetElement.bind(this);
    }

    createElement(): UiElement {
        return {
            key: '',
            bounds: { x: 0, y: 0, w: 0, h: 0 },
            drawBuffer: [],
            children: [],
            layer: this.defaultLayer,
            flags: 0,
        };
    }

    resetElement(element: UiElement): void {
        element.key = '';
        delete element.parent;
        element.layer = this.defaultLayer;
        element.drawBuffer.length = 0;
        element.children.length = 0;
        element.flags = 0;

        const { bounds } = element;
        bounds.x = 0;
        bounds.y = 0;
        bounds.h = 0;
        bounds.w = 0;
    }
}

