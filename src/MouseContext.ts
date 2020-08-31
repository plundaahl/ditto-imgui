enum ClickState {
    IDLE,
    DOWN,
    RELEASED,
};


export class MouseContext {

    private _x: number = 0;
    private _y: number = 0;
    private _mouseDownX: number = 0;
    private _mouseDownY: number = 0;
    private _prevX: number = 0;
    private _prevY: number = 0;
    private _isMouseDown: boolean = false;
    private _isClick: ClickState = ClickState.IDLE;

    constructor(element: HTMLElement) {
        element.onmousemove = this.onMouseMove.bind(this);
        element.onmousedown = this.onMouseDown.bind(this);
        element.onmouseup = this.onMouseUp.bind(this);
    }

    get x(): number { return this._x; };
    get y(): number { return this._y; };
    get isMouseDown(): boolean { return this._isMouseDown; }
    get isClick(): boolean { return this._isClick === ClickState.RELEASED; }
    get clickX(): number { return this._mouseDownX; }
    get clickY(): number { return this._mouseDownY; }
    get prevX(): number { return this._prevX; }
    get prevY(): number { return this._prevY; }

    public update(): void {
        this._prevX = this._x;
        this._prevY = this._y;
        if (this._isClick === ClickState.RELEASED) {
            this._isClick = ClickState.IDLE;
        }
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
