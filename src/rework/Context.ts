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
    beginFloatingElement(): void;
    endFloatingElement(): void;
    render(context: CanvasRenderingContext2D): void;
}

export class ContextImpl implements Context {
    protected readonly elementPool: ObjectPool<UiElement>;
    protected readonly elementTree: UiElement;
    protected readonly navigationStack: UiElement[] = [];
    protected readonly elementTypeStack: ElementType[] = [];

    constructor(
        createCanvasFn: () => CanvasRenderingContext2D,
    ) {
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
        const child = this.elementPool.provision();
        const parent = this.curElement;

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

    beginFloatingElement(): void {
        const child = this.elementPool.provision();
        this.curElement.floatingChildren.push(child);
        this.navigationStack.push(child);
        this.elementTypeStack.push(ElementType.FLOATING);
    }

    endFloatingElement(): void {
        if (this.navigationStack.length === 1) {
            throw new Error("You called endFloatingElement() more times than beginFloatingElement(). Cannot remove root element. Are your endFloatingElement() and beginFloatingElement() calls mismatched?");
        }

        const elementType = this.elementTypeStack.pop();
        if (elementType !== ElementType.FLOATING) {
            if (elementType !== undefined) {
                this.elementTypeStack.push(elementType);
            }
            throw new Error(`endFloatingElement() was called for a mismatched begin* call. Expect ElementType ${ElementType.FLOATING}, but was type ${elementType}`);
        }

        this.navigationStack.pop();
    }

    render(context: CanvasRenderingContext2D): void {
    }

    private preRender(): void {
    }

    protected forEachElementDfs(callback: (element: UiElement) => void): void {
        this.recurseElementsDfs(this.elementTree, callback);
    }

    private recurseElementsDfs(
        element: UiElement,
        callback: (element: UiElement) => void,
    ): void {
        callback(element);

        for (let child of element.children) {
            this.recurseElementsDfs(child, callback);
        }

        for (let child of element.floatingChildren) {
            this.recurseElementsDfs(child, callback);
        }
    }
}

