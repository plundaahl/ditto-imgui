import { UiElement } from './UiElement';
import { Layer } from './Layer';
import { DrawContext } from './DrawBuffer';
import { BoundingBox } from './BoundingBox';
import { ObjectPool } from './ObjectPool';
import { StateManager } from './StateManager';
import { KeyCollisionDetector } from './KeyCollisionDetector';

export interface Context {
    readonly draw: DrawContext;
    readonly bounds: BoundingBox;
    beginLayer(key: string): void;
    endLayer(): void;
    beginElement(key: string): void;
    endElement(): void;
    floatElement(): void;
    render(context: CanvasRenderingContext2D): void;
}

export class ContextImpl implements Context {
    protected readonly keyCollisionDetector: KeyCollisionDetector;
    protected readonly stateManager: StateManager;
    protected readonly elementPool: ObjectPool<UiElement>;
    protected readonly layers: Layer[] = [];
    protected readonly buildStack: Layer[] = [];
    private context?: CanvasRenderingContext2D;

    constructor(args: {
        createCanvasFn: () => CanvasRenderingContext2D,
        stateManager: StateManager,
        keyCollisionDetector: KeyCollisionDetector,
    }) {
        const {
            createCanvasFn,
            stateManager,
            keyCollisionDetector,
        } = args;

        this.stateManager = stateManager;
        this.keyCollisionDetector = keyCollisionDetector,

        this.beginElement = this.beginElement.bind(this);
        this.endElement = this.endElement.bind(this);
        this.render = this.render.bind(this);
        this.renderElement = this.renderElement.bind(this);
        this.dfsNonFloatSubraph = this.dfsNonFloatSubraph.bind(this);

        this.elementPool = new ObjectPool(
            UiElement.create.bind(UiElement, createCanvasFn),
            UiElement.reset,
        );

        this.beginLayer('_root');
    }

    get draw(): DrawContext {
        return this.curElement.drawBuffer;
    }

    get bounds(): BoundingBox {
        return this.curElement.boundingBox;
    }

    protected get curLayer(): Layer {
        const curLayer = this.buildStack[this.buildStack.length - 1];
        if (curLayer === undefined) {
            throw new Error('No layer currently mounted');
        }
        return curLayer;
    }

    protected get curElement() {
        const curLayerBuildStack = this.curLayer.buildStack;
        return curLayerBuildStack[curLayerBuildStack.length - 1];
    }

    registerStateHandle<T extends {}>(key: string) {
        return this.stateManager.registerHandle<T>(key);
    }

    beginLayer(key: string): void {
        const root = this.elementPool.provision();
        const layer = {
            root,
            floats: [ root ],
            buildStack: [ root ],
        };
        this.layers.push(layer);
        this.buildStack.push(layer);
        this.keyCollisionDetector.beginKey(key);
        this.stateManager.beginKey(key);
    }

    endLayer(): void {
        if (this.buildStack.length === 0) {
            throw new Error(`There are no more layers to end. Please match your beginLayer() and endLayer() calls`);
        }

        if (this.curLayer.buildStack.length > 1) {
            const nUnfinishedElements = this.curLayer.buildStack.length - 1;
            throw new Error(`You are trying to end the current layer, but it currently contains the root element + ${nUnfinishedElements} unfinished elements. Please call endElement() ${nUnfinishedElements} more times before calling endLayer()`);
        }

        this.curLayer.buildStack.pop();
        this.buildStack.pop();
        this.keyCollisionDetector.endKey();
        this.stateManager.endKey();
    }

    beginElement(key: string): void {
        const parent = this.curElement;
        const child = this.elementPool.provision();

        this.curElement.children.push(child);
        this.curLayer.buildStack.push(child);

        parent.onBeginChild(parent, child);
        this.keyCollisionDetector.beginKey(key);
        this.stateManager.beginKey(key);
    }

    endElement(): void {
        if (this.curLayer.buildStack.length === 1) {
            throw new Error("You called endElement() more times than beginElement(). Cannot remove root element. Are your endElement() and beginElement() calls mismatched?");
        }

        const child = this.curElement;
        this.curLayer.buildStack.pop();
        this.keyCollisionDetector.endKey();
        this.stateManager.endKey();
        this.curElement.onEndChild(this.curElement, child);
    }

    floatElement(): void {
        this.curElement.zIndex++;
        this.curLayer.floats.push(this.curElement);
    }

    render(context: CanvasRenderingContext2D): void {
        this.endLayer();

        this.context = context;
        this.keyCollisionDetector.reset();
        this.layers.sort(zIndexComparator);
        for (let layer of this.layers) {
            for (let element of layer.floats) {
                this.dfsNonFloatSubraph(
                    element,
                    this.renderElement,
                );
            }
        }
        delete this.context;

        this.beginLayer('_root');
    }

    protected renderElement(element: UiElement) {
        element.sortChildrenByZIndex();
        element.drawBuffer.render(this.context as CanvasRenderingContext2D);
        element.drawBuffer.clear();
    }

    protected dfsNonFloatSubraph(
        element: UiElement,
        onPreOrder: (element: UiElement) => void,
    ): void {
        onPreOrder(element);

        for (let child of element.children) {
            if (child.zIndex === 0) {
                this.dfsNonFloatSubraph(child, onPreOrder);
            }
        }
    }
}

function zIndexComparator(a: Layer, b: Layer): number {
    return a.root.zIndex - b.root.zIndex || 1;
}

