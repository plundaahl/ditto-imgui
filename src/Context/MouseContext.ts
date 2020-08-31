import { ElementActiveState } from './shared';

enum ClickState {
    UP,
    DOWN,
    RELEASED,
};

type BoundingBox = [
    number, // left
    number, // top
    number, // right
    number, // bottom
];
const BOX_LEFT = 0;
const BOX_TOP = 1;
const BOX_RIGHT = 2;
const BOX_BOTTOM = 3;

export interface IMouseContext {
    getX(): number;
    getY(): number;
    getPrevX(): number;
    getPrevY(): number;
    getDragX(): number;
    getDragY(): number;

    isMouseDown(): boolean;
    isCurElementUnderMouse(): boolean;
    isCurElementHovered(): boolean;
    isCurElementDragged(): boolean;
    isCurElementClicked(): boolean;
}

export class MouseContext implements IMouseContext {

    public activeElement: ElementActiveState = ElementActiveState.NONE;
    private elementBboxStack: BoundingBox[] = [];

    private _x: number = 0;
    private _y: number = 0;
    private _mouseDownX: number = 0;
    private _mouseDownY: number = 0;
    private _prevX: number = 0;
    private _prevY: number = 0;
    private _isMouseDown: boolean = false;
    private _isClick: ClickState = ClickState.UP;

    constructor(element: HTMLElement) {
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.isMouseDown = this.isMouseDown.bind(this);
        this.isCurElementUnderMouse = this.isCurElementUnderMouse.bind(this);
        this.isCurElementHovered = this.isCurElementHovered.bind(this);
        this.isCurElementDragged = this.isCurElementDragged.bind(this);
        this.isCurElementClicked = this.isCurElementClicked.bind(this);

        element.addEventListener('mousemove', this.onMouseMove);
        element.addEventListener('mousedown', this.onMouseDown);
        element.addEventListener('mouseup', this.onMouseUp);
    }

    getX(): number { return this._x; };
    getY(): number { return this._y; };
    getPrevX(): number { return this._prevX; }
    getPrevY(): number { return this._prevY; }
    getDragX(): number { return this._x - this._prevX; }
    getDragY(): number { return this._y - this._prevY; }

    update(): void {
        this._prevX = this._x;
        this._prevY = this._y;

        if (this._isClick === ClickState.RELEASED) {
            this._isClick = ClickState.UP;
        }

        if (this.elementBboxStack.length !== 0) {
            throw new Error('Mismatched number of calls to #pushElement and #popElement.');
        }
    }

    pushElement(x: number, y: number, w: number, h: number) {
        const { elementBboxStack } = this;
        const prevElement = elementBboxStack[elementBboxStack.length - 1];
        const prevLeft = prevElement ? prevElement[BOX_LEFT] : 0;
        const prevTop = prevElement ? prevElement[BOX_TOP] : 0;

        this.elementBboxStack.push([
            x + prevLeft,
            y + prevTop,
            x + w + prevLeft,
            y + h + prevTop,
        ]);
    }

    popElement() {
        this.elementBboxStack.pop();
    }

    isMouseDown(): boolean {
        return this._isMouseDown;
    }

    isCurElementUnderMouse(): boolean {
        return this.isPointOverElement(this._x, this._y);
    }

    isCurElementHovered(): boolean {
        return this.activeElement === ElementActiveState.NONE &&
            this.isPointOverElement(
                this._x,
                this._y,
            );
    }

    isCurElementDragged(): boolean {
        return this._isMouseDown && this.isPointOverElement(
            this._prevX,
            this._prevY,
        );
    }

    isCurElementClicked(): boolean {
        return this._isClick === ClickState.RELEASED && this.isPointOverElement(
            this._mouseDownX,
            this._mouseDownY,
        );
    }

    private isPointOverElement(x: number, y: number): boolean {
        const curElement = this.elementBboxStack[this.elementBboxStack.length - 1];
        if (!curElement) {
            return false;
        }

        return (
            curElement[BOX_LEFT] <= x && x <= curElement[BOX_RIGHT] &&
            curElement[BOX_TOP] <= y && y <= curElement[BOX_BOTTOM]
        );
    }

    private onMouseMove(event: MouseEvent): void {
        this._x = event.clientX;
        this._y = event.clientY;
    }

    private onMouseDown(event: MouseEvent): void {
        this._isMouseDown = true;
        this._mouseDownX = event.clientX;
        this._mouseDownY = event.clientY;
        this._isClick = ClickState.DOWN;
    }

    private onMouseUp(event: MouseEvent): void {
        this._isMouseDown = false;
        this._isClick = ClickState.RELEASED;
    }
}
