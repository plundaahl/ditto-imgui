import { ElementActiveState } from './shared';

enum ClickState {
    UP,
    DOWN,
    RELEASED,
};

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
    private curElementLeft: number = 0;
    private curElementTop: number = 0;
    private curElementRight: number = 0;
    private curElementBottom: number = 0;

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
    }

    clearCurElement() {
        this.curElementLeft = 0;
        this.curElementRight = -1;
    }

    setCurElementBounds(x: number, y: number, w: number, h: number) {
        this.curElementLeft = x;
        this.curElementTop = y;
        this.curElementBottom = y + h;
        this.curElementRight = x + w;
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
        const {
            curElementBottom,
            curElementLeft,
            curElementRight,
            curElementTop,
        } = this;

        return (
            curElementLeft <= x && x <= curElementRight &&
            curElementTop <= y && y <= curElementBottom
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
