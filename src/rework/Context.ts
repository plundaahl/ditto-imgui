import { UiElement } from './UiElement';
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
    protected readonly elementTree: UiElement;
    protected readonly layers: UiElement[] = [];
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

        let rootElement = this.elementPool.provision();
        this.layers.push(rootElement);
        this.elementTree = rootElement;
        this.buildStack.push([ rootElement ]);
    }

    get draw(): DrawContext {
        return this.curElement.drawBuffer;
    }

    get bounds(): BoundingBox {
        return this.curElement.boundingBox;
    }

    protected get curLayerStack(): UiElement[] {
        const curLayerStack = this.buildStack[this.buildStack.length - 1];
        if (curLayerStack === undefined) {
            throw new Error('No layer currently mounted');
        }
        return curLayerStack;
    }

    protected get curElement() {
        const { curLayerStack } = this;
        return curLayerStack[curLayerStack.length - 1];
    }

    beginLayer(): void {
        this.buildStack.push([ this.elementPool.provision() ]);
    }

    endLayer(): void {
        if (this.curLayerStack.length > 1) {
            const nUnfinishedElements = this.curLayerStack.length - 1;
            throw new Error(`You are trying to end the current layer, but it currently contains the root element + ${nUnfinishedElements} unfinished elements. Please call endElement() ${nUnfinishedElements} more times before calling endLayer()`);
        }
    }

    beginElement(): void {
        const parent = this.curElement;
        const child = this.elementPool.provision();

        this.curElement.children.push(child);
        this.curLayerStack.push(child);

        parent.onBeginChild(parent, child);
    }

    endElement(): void {
        if (this.curLayerStack.length === 1) {
            throw new Error("You called endElement() more times than beginElement(). Cannot remove root element. Are your endElement() and beginElement() calls mismatched?");
        }

        const child = this.curElement;
        this.curLayerStack.pop();
        this.curElement.onEndChild(this.curElement, child);
    }

    render(context: CanvasRenderingContext2D): void {
        this.context = context;
        for (let layer of this.layers) {
            layer.forEachDfs(this.renderElement);
        }
        delete this.context;
    }

    protected renderElement(element: UiElement) {
        element.sortChildrenByZIndex();
        element.drawBuffer.render(this.context as CanvasRenderingContext2D);
        element.drawBuffer.clear();
    }
}

