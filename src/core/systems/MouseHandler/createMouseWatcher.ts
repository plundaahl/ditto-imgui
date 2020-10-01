import { MouseWatcher, MouseAction } from './MouseWatcher';

const M1 = 1;
const M2 = 2;

export function createMouseWatcher(
    canvas: HTMLCanvasElement,
): MouseWatcher {
    const watcher: MouseWatcher = {
        posX: 0,
        posY: 0,
        dragX: 0,
        dragY: 0,
        isOverCanvas: false,
        m1Down: false,
        m2Down: false,
        action: MouseAction.NONE,
    };

    canvas.addEventListener('mousemove', (e) => {
        e.preventDefault();
        watcher.posX = e.x;
        watcher.posY = e.y;

        if (watcher.m1Down) {
            watcher.action = MouseAction.DRAG;
            watcher.dragX = e.movementX;
            watcher.dragY = e.movementY;
        }
    });

    canvas.addEventListener('mouseenter', (e) => {
        e.preventDefault();
        watcher.isOverCanvas = true;
    });

    canvas.addEventListener('mouseleave', (e) => {
        e.preventDefault();
        watcher.isOverCanvas = false;
    });

    canvas.addEventListener('click', (e) => {
        e.preventDefault();
        watcher.action = MouseAction.CLICK;
    });

    canvas.addEventListener('dblclick', (e) => {
        e.preventDefault();
        watcher.action = MouseAction.DOUBLE_CLICK;
    });

    canvas.oncontextmenu = () => false;
    canvas.addEventListener('auxclick', (e) => {
        e.preventDefault();
        watcher.action = MouseAction.M2_CLICK;
    });

    const handleButtonStateChange = (e: MouseEvent) => {
        e.preventDefault();
        watcher.m1Down = (e.buttons & M1) !== 0;
        watcher.m2Down = (e.buttons & M2) !== 0;

        if (watcher.action === MouseAction.DRAG) {
            watcher.action = MouseAction.NONE;
        }
    };

    document.addEventListener('mousedown', handleButtonStateChange);
    document.addEventListener('mouseup', handleButtonStateChange);

    return watcher;
}

