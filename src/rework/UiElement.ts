import { BoundingBox } from './BoundingBox';
import { DrawBuffer } from './DrawBuffer';

function defaultChildChangeFn() {}

export class UiElement {
    public readonly boundingBox: BoundingBox = new BoundingBox();
    public readonly drawBuffer: DrawBuffer;
    public readonly children: UiElement[] = [];
    public key: string | undefined;
    public zIndex: number = 0;
    public onBeginChild: (self: UiElement, child: UiElement) => void;
    public onEndChild: (self: UiElement, child: UiElement) => void;

    constructor(createCanvasContext: () => CanvasRenderingContext2D) {
        this.drawBuffer = new DrawBuffer(createCanvasContext);
        this.onBeginChild = defaultChildChangeFn;
        this.onEndChild = defaultChildChangeFn;
    }

    static create(createCanvasContext: () => CanvasRenderingContext2D) {
        return new UiElement(createCanvasContext);
    }

    static reset(element: UiElement) {
        element.children.length = 0;
        delete element.key;
        element.zIndex = 0;
        element.onBeginChild = defaultChildChangeFn;
        element.onEndChild = defaultChildChangeFn;
    }

    sortChildrenByZIndex() {
        this.children.sort(zIndexComparator);
    }
}

function zIndexComparator(a: UiElement, b: UiElement): number {
    return a.zIndex - b.zIndex || 1;
}
