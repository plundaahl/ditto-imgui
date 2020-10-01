export enum MouseAction {
    NONE,
    CLICK,
    DOUBLE_CLICK,
    M2_CLICK,
    DRAG,
}

export interface MouseWatcher {
    posX: number;
    posY: number;
    dragX: number;
    dragY: number;
    isOverCanvas: boolean;
    m1Down: boolean;
    m2Down: boolean;
    action: MouseAction,
}

export interface ReadonlyMouseWatcher extends MouseWatcher {
    readonly posX: number;
    readonly posY: number;
    readonly isOverCanvas: boolean;
    readonly m1Down: boolean;
    readonly m2Down: boolean;
}

