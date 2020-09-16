import { UiElement } from './UiElement';
import { DrawContext } from './DrawBuffer';
import { BoundingBox } from './BoundingBox';
import { ObjectPool } from './ObjectPool';

enum ElementType {
    INFLOW,
    FLOATING,
}

export interface Context {
    readonly draw: DrawContext;
    readonly bounds: BoundingBox;
    beginElement(): void;
    endElement(): void;
    render(context: CanvasRenderingContext2D): void;
}

export class ContextImpl implements Context {
    protected readonly elementPool: ObjectPool<UiElement>;
    protected readonly elementTree: UiElement;
    protected readonly navigationStack: UiElement[] = [];
    protected readonly elementTypeStack: ElementType[] = [];
    private context?: CanvasRenderingContext2D;

    constructor(
        createCanvasFn: () => CanvasRenderingContext2D,
    ) {
        this.beginElement = this.beginElement.bind(this);
        this.endElement = this.endElement.bind(this);
        this.render = this.render.bind(this);
        this.renderElement = this.renderElement.bind(this);
        this.forEachElementDfs = this.forEachElementDfs.bind(this);
        this.recurseElementsDfs = this.recurseElementsDfs.bind(this);

        this.elementPool = new ObjectPool(
            UiElement.create.bind(UiElement, createCanvasFn),
            UiElement.reset,
        );

        this.elementTree = this.elementPool.provision();
        this.navigationStack.push(this.elementTree);
        this.elementTypeStack.push(ElementType.INFLOW);
    }

    get draw(): DrawContext {
        return this.curElement.drawBuffer;
    }

    get bounds(): BoundingBox {
        return this.curElement.boundingBox;
    }

    protected get curElement() {
        return this.navigationStack[this.navigationStack.length - 1];
    }

    beginElement(): void {
        const parent = this.curElement;
        const child = this.elementPool.provision();

        this.curElement.children.push(child);
        this.navigationStack.push(child);
        this.elementTypeStack.push(ElementType.INFLOW);

        parent.onBeginChild(parent, child);
    }

    endElement(): void {
        if (this.navigationStack.length === 1) {
            throw new Error("You called endElement() more times than beginElement(). Cannot remove root element. Are your endElement() and beginElement() calls mismatched?");
        }

        const elementType = this.elementTypeStack.pop();
        if (elementType !== ElementType.INFLOW) {
            if (elementType !== undefined) {
                this.elementTypeStack.push(elementType);
            }
            throw new Error(`endElement() was called for a mismatched begin* call. Expect ElementType ${ElementType.INFLOW}, but was type ${elementType}`);
        }

        const child = this.curElement;
        this.navigationStack.pop();
        this.curElement.onEndChild(this.curElement, child);
    }

    render(context: CanvasRenderingContext2D): void {
        this.context = context;
        this.forEachElementDfs(this.renderElement);
        delete this.context;
    }

    private renderElement(element: UiElement) {
        element.sortChildrenByZIndex();
        element.drawBuffer.render(this.context as CanvasRenderingContext2D);
        element.drawBuffer.clear();
    }

    protected forEachElementDfs(onPreOrder: (element: UiElement) => void): void {
        this.recurseElementsDfs(this.elementTree, onPreOrder);
    }

    private recurseElementsDfs(
        element: UiElement,
        onPreOrder: undefined | ((element: UiElement) => void),
    ): void {
        onPreOrder && onPreOrder(element);

        for (let child of element.children) {
            this.recurseElementsDfs(child, onPreOrder);
        }
    }
}

