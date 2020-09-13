import { UiElement } from './UiElement';
import { DrawContext } from './DrawBuffer';
import { BoundingBox } from './BoundingBox';
import { ObjectPool } from './ObjectPool';

export interface Context {
    readonly draw: DrawContext;
    readonly bounds: BoundingBox;
    beginElement(): void;
    endElement(): void;
}

export class ContextImpl implements Context {
    protected readonly elementPool: ObjectPool<UiElement>;
    protected readonly elementTree: UiElement;
    protected readonly navigationStack: UiElement[] = [];
    protected curElement: UiElement;

    constructor(
        createCanvasFn: () => CanvasRenderingContext2D,
    ) {
        this.elementPool = new ObjectPool(
            UiElement.create.bind(UiElement, createCanvasFn),
            UiElement.reset,
        );

        this.elementTree = this.elementPool.provision();
        this.navigationStack.push(this.elementTree);
        this.curElement = this.elementTree;
    }

    get draw(): DrawContext {
        return this.curElement.drawBuffer;
    }

    get bounds(): BoundingBox {
        return this.curElement.boundingBox;
    }

    beginElement(): void {
        const child = this.elementPool.provision();
        const parent = this.curElement;

        this.curElement.children.push(child);
        this.curElement = child;
        this.navigationStack.push(child);

        parent.onBeginChild(parent, child);
    }

    endElement(): void {
        const child = this.curElement;

        this.navigationStack.pop();
        this.curElement = this.navigationStack[this.navigationStack.length - 1];

        this.curElement.onEndChild(this.curElement, child);
    }
}

