import { IOrderedSet, ArrayOrderedSet } from '../lib/OrderedSet';

type Key = string;

interface BoundingBox {
    x: number;
    y: number;
    w: number;
    h: number;
}

interface WindowState {
    x: number;
    y: number;
    w: number;
    h: number;
    isOpen: boolean;
}

interface WindowRenderDetails {
    key: Key,
    boundingBox: BoundingBox,
}

export interface WindowContextUserAPI {
    beginWindow(key: Key, initialState?: WindowState): boolean;
    endWindow(): Key;
    setBoundingBox(x: number, y: number, w: number, h: number): void;
    getBoundingBox(): BoundingBox;
    setOpen(open: boolean): void;
    bringToFront(): void;
    wasWindowHoveredLastFrame(): boolean;
}

export interface WindowContextRenderAPI {
    getOrderedWindowRenderDetails(): WindowRenderDetails[];
    onPostRender(): void;
    setMouseCoordinates(x: number, y: number): void;
}

export class WindowContext
    implements WindowContextUserAPI, WindowContextRenderAPI {


    // Stores the state objects for all registered windows.
    protected readonly windowStateLookup: Map<Key, WindowState> = new Map();

    // Stores window draw order, from back to front
    protected readonly zOrder: IOrderedSet<Key> = new ArrayOrderedSet();

    // stores current state of build stack
    protected readonly buildStack: Array<Key> = [];

    // Tracks windows to be expired (happens in onPreRender)
    protected readonly expiredWindows: Set<Key> = new Set();

    // Window that was hovered last frame
    protected hoveredWindow: Key | undefined;

    private mouseX: number;
    private mouseY: number;

    beginWindow(key: string, initialState?: WindowState): boolean {
        this.buildStack.push(key);

        let state = this.windowStateLookup.get(key);
        if (!state) {
            state = initialState || createDefaultWindowState();
            this.windowStateLookup.set(key, state);
        }

        if (!this.zOrder.has(key)) {
            this.zOrder.pushToFront(key);
        }

        this.expiredWindows.delete(key);

        return state.isOpen;
    }

    endWindow(): Key {
        const { buildStack } = this;
        buildStack.pop();
        return this.getCurrentKey();
    }

    bringToFront(): void {
        this.zOrder.pushToFront(this.getCurrentKey());
    }

    wasWindowHoveredLastFrame(): boolean {
        return this.hoveredWindow === this.getCurrentKey();
    }

    setBoundingBox(x: number, y: number, w: number, h: number): void {
        const state = this.windowStateLookup.get(this.getCurrentKey());
        if (!state) {
            throw new Error(`No window currently pushed`);
        }
        state.x = x;
        state.y = y;
        state.w = w;
        state.h = h;
    }

    getBoundingBox(): BoundingBox {
        const state = this.windowStateLookup.get(this.getCurrentKey());
        if (!state) {
            throw new Error(`No window currently pushed`);
        }
        const { x, y, w, h } = state;
        return { x, y, w, h };
    }

    setOpen(open: boolean): void {
        const state = this.windowStateLookup.get(this.getCurrentKey());
        if (!state) {
            throw new Error(`No window currently pushed`);
        }
        state.isOpen = open;
    }

    onPreRender(): void {
        const {
            zOrder,
            expiredWindows,
            windowStateLookup,
            mouseX,
            mouseY,
        } = this;

        // Clear the draw order of any windows that weren't pushed this frame
        for (let window of expiredWindows) {
            zOrder.delete(window);
        }

        // Empty expiredWindows and fill it with all windows seen this frame
        expiredWindows.clear();
        for (let window of zOrder) {
            expiredWindows.add(window);
        }

        // Get currently-hovered window, going top-to-bottom of draw order
        const windowOrder = [...zOrder];

        delete this.hoveredWindow;

        for (let i = windowOrder.length - 1; i >= 0; i--) {
            const window = windowStateLookup.get(windowOrder[i]);
            if (!window) {
                throw new Error(`No window state for key ${windowOrder[i]}, index ${i}`);
            }

            const left = window.x;
            const top = window.y;
            const right = left + window.w;
            const bottom = top + window.h;

            if (
                window.isOpen &&
                left <= mouseX && mouseX <= right &&
                top <= mouseY && mouseY <= bottom
            ) {
                this.hoveredWindow = windowOrder[i];
                break;
            }
        }
    }

    getOrderedWindowRenderDetails(): WindowRenderDetails[] {
        const { windowStateLookup } = this;

        return [...this.zOrder].map(key => ({
            key,
            boundingBox: windowStateLookup.get(key) as WindowState,
        }));
    }

    onPostRender(): void {
    }

    setMouseCoordinates(x: number, y: number): void {
        this.mouseX = x;
        this.mouseY = y;
    }

    private getCurrentKey(): Key {
        return this.buildStack[this.buildStack.length - 1];
    }
}

function createDefaultWindowState(): WindowState {
    return {
        x: 0,
        y: 0,
        w: 0,
        h: 0,
        isOpen: true,
    };
}
