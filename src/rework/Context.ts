import { UiElement } from './UiElement';
import { Layer } from './Layer';
import { DrawContext } from './DrawBuffer';
import { BoundingBox } from './BoundingBox';
import { ObjectPool } from './ObjectPool';

export interface Context {
    readonly draw: DrawContext;
    readonly bounds: BoundingBox;
    beginLayer(): void;
    endLayer(): void;
    beginElement(): void;
    endElement(): void;
    render(context: CanvasRenderingContext2D): void;
}

export class ContextImpl implements Context {
    protected readonly elementPool: ObjectPool<UiElement>;
    protected readonly layers: Layer[] = [];
    protected readonly buildStack: UiElement[][] = [];
    private context?: CanvasRenderingContext2D;

    constructor(
        createCanvasFn: () => CanvasRenderingContext2D,
    ) {
        this.beginElement = this.beginElement.bind(this);
        this.endElement = this.endElement.bind(this);
        this.render = this.render.bind(this);
        this.renderElement = this.renderElement.bind(this);

        this.elementPool = new ObjectPool(
            UiElement.create.bind(UiElement, createCanvasFn),
            UiElement.reset,
        );

        this.beginLayer();
    }

    get draw(): DrawContext {
        return this.curElement.drawBuffer;
    }

    get bounds(): BoundingBox {
        return this.curElement.boundingBox;
    }

    protected get curLayer(): UiElement[] {
        const curLayer = this.buildStack[this.buildStack.length - 1];
        if (curLayer === undefined) {
            throw new Error('No layer currently mounted');
        }
        return curLayer;
    }

    protected get curElement() {
        const { curLayer } = this;
        return curLayer[curLayer.length - 1];
    }

    beginLayer(): void {
        const root= this.elementPool.provision();
        this.layers.push({ root, floats: [] });
        this.buildStack.push([root]);
    }

    endLayer(): void {
        if (this.curLayer.length > 1) {
            const nUnfinishedElements = this.curLayer.length - 1;
            throw new Error(`You are trying to end the current layer, but it currently contains the root element + ${nUnfinishedElements} unfinished elements. Please call endElement() ${nUnfinishedElements} more times before calling endLayer()`);
        }

        if (this.buildStack.length === 0) {
            throw new Error(`There are no more layers to end. Please match your beginLayer() and endLayer() calls`);
        }

        this.curLayer.pop();
        this.buildStack.pop();
    }

    beginElement(): void {
        const parent = this.curElement;
        const child = this.elementPool.provision();

        this.curElement.children.push(child);
        this.curLayer.push(child);

        parent.onBeginChild(parent, child);
    }

    endElement(): void {
        if (this.curLayer.length === 1) {
            throw new Error("You called endElement() more times than beginElement(). Cannot remove root element. Are your endElement() and beginElement() calls mismatched?");
        }

        const child = this.curElement;
        this.curLayer.pop();
        this.curElement.onEndChild(this.curElement, child);
    }

    render(context: CanvasRenderingContext2D): void {
        this.context = context;
        this.layers.sort(zIndexComparator);
        for (let layer of this.layers) {
            layer.root.forEachDfs(this.renderElement);
        }
        delete this.context;
    }

    protected renderElement(element: UiElement) {
        element.sortChildrenByZIndex();
        element.drawBuffer.render(this.context as CanvasRenderingContext2D);
        element.drawBuffer.clear();
    }
}

function zIndexComparator(a: Layer, b: Layer): number {
    return a.root.zIndex - b.root.zIndex || 1;
}

