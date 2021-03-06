import { Layer, UiElement, Box } from '../../types';
import { ElementService } from './ElementService';
import { ObjectPool } from '../../lib/ObjectPool';

export class ElementServiceImpl implements ElementService {
    private readonly buildStack: UiElement[] = [];
    private readonly allElements: UiElement[] = [];
    private currentLayer?: Layer;
    private currentElement?: UiElement;

    constructor(
        private readonly elementPool: ObjectPool<UiElement>,
    ) {
        this.setCurrentLayer = this.setCurrentLayer.bind(this);
        this.beginElement = this.beginElement.bind(this);
        this.endElement = this.endElement.bind(this);
        this.getCurrentElement = this.getCurrentElement.bind(this);
        this.getBounds = this.getBounds.bind(this);
        this.onPostRender = this.onPostRender.bind(this);
    }

    getBounds(): Box {
        const element = this.currentElement;
        if (!element) {
            throw new Error('No element active');
        }
        return element.bounds;
    }

    setCurrentLayer(layer: Layer | undefined): void {
        this.currentLayer = layer;
    }

    beginElement(key: string, flags: number): void {
        const layer = this.currentLayer;
        if (!layer) {
            throw new Error('cannot create layer when no layer is set');
        }

        const parent = this.currentElement;
        const element: UiElement = this.elementPool.provision();
        element.layer = layer;
        element.key = key;
        element.flags = flags;

        if (parent) {
            element.parent = parent;
            parent.children.push(element);
        }

        this.buildStack.push(element);
        this.allElements.push(element);
        this.currentElement = element;
    }

    endElement(): void {
        const { buildStack } = this;

        if (buildStack.length === 0) {
            throw new Error('No elements currently pushed. beginElement and endElement calls must be balanced.');
        }

        buildStack.pop();
        this.currentElement = buildStack[buildStack.length - 1];
    }

    getCurrentElement(): UiElement | undefined{
        return this.currentElement;
    }

    onPostRender(): void {
        if (this.buildStack.length !== 0) {
            throw new Error('Cannot call onPostRender when not all elements have been properly finished. beginElement and endElement calls must be balanced before calling render.');
        }

        for (const element of this.allElements) {
            this.elementPool.release(element);
        }

        this.allElements.length = 0;
    }
}
