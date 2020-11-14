export enum MouseAction {
    NONE,
    M1_CLICK,
    M1_DOUBLECLICK,
    M1_DRAG,
    M2_CLICK,
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

