import { run } from './runner';
import { createContext, getContext } from '../src/core';

const { canvas, context } = setupCanvas();
createContext(canvas);
const gui = getContext();

(window as any).gui = gui;

let dummyIds: number[] = [];
let nextId: number = 0;

function main() {
    resetCanvas(context);

    beginPanel('Control Panel', 50, 50, 100, 100);
    if (button('Increment')) {
        dummyIds.push(nextId++);
    }
    endPanel();

    beginPanel('Display Panel', 250, 50, 100, 200);
    beginScrollRegion('DisplayScroll');
    for (let i = 0; i < dummyIds.length; i++) {
        const id = dummyIds[i];
        if (button(`Button ${id}`)) {
            dummyIds = dummyIds.filter(element => element !== id);
        }
    }
    endScrollRegion();
    endPanel();

    gui.render();
}

function button(key: string) {
    gui.beginElement(key);
    const { bounds } = gui.currentElement;

    bounds.h = 30;

    if (gui.mouse.hoversElement()) {
        if (gui.mouse.isM1Down()) {
            gui.drawContext.setFillStyle('#FF0000');
        } else if (gui.mouse.isM2Down()) {
            gui.drawContext.setFillStyle('#0000FF');
        } else {
            gui.drawContext.setFillStyle('#FFAAAA');
        }
    } else {
        gui.drawContext.setFillStyle('#EEEEEE');
    }

    const { x, y, w, h } = bounds;

    gui.drawContext.fillRect(x, y, w, h);
    gui.drawContext.setStrokeStyle('#000000');
    gui.drawContext.strokeRect(x, y, w, h);

    gui.drawContext.setFillStyle('#000000');
    gui.drawContext.drawText(key, x + 10, y + 10);

    let isClicked = gui.mouse.hoversElement() && gui.mouse.isM1Clicked();

    gui.endElement();

    return isClicked;
}


const panelStateHandle = gui.state.createHandle<{ x: number, y: number }>('panel');

function beginPanel(key: string, x: number, y: number, w: number, h: number) {
    gui.beginLayer(key);

    const state = panelStateHandle.declareAndGetState({ x, y });

    if (gui.mouse.hoversElement()) {
        if (gui.mouse.isM1Dragged()) {
            state.x += gui.mouse.dragX;
            state.y += gui.mouse.dragY;
        }
    }

    if (gui.mouse.hoversElement() || gui.mouse.hoversChild()) {
        if (gui.mouse.isM1Down() || gui.mouse.isM2Down()) {
            gui.currentLayer.bringToFront();
        }
    }

    const bounds = gui.currentElement.bounds;
    bounds.x = state.x;
    bounds.y = state.y;
    bounds.w = w;
    bounds.h = h;

    gui.drawContext.setFillStyle('#DDDDDD');
    gui.drawContext.fillRect(state.x, state.y, w, h);

    gui.drawContext.setStrokeStyle('#000000');
    gui.drawContext.strokeRect(state.x, state.y, w, h);

    gui.drawContext.beginPath();
    gui.drawContext.rect(state.x + 1, state.y + 1, w - 2, h - 2);
    gui.drawContext.clip();
}

function endPanel() {
    gui.endLayer();
}


type ScrollState = {
    offsetY: number,
    parentH: number,
    drawY: boolean,
};
const defaultScrollState: ScrollState = {
    offsetY: 0,
    parentH: 0,
    drawY: false,
};
const scrollStateHandle = gui.state.createHandle<ScrollState>('scrollregion');
const SCROLLBAR_WIDTH = 15;
function beginScrollRegion(key: string) {
    const parentBounds = gui.currentElement.bounds;

    gui.beginElement(key); // CONTAINER
    gui.currentElement.bounds.x = parentBounds.x;
    gui.currentElement.bounds.y = parentBounds.y;
    gui.currentElement.bounds.w = parentBounds.w;
    gui.currentElement.bounds.h = parentBounds.h;

    gui.beginElement('content'); // CONTENT
    const state = scrollStateHandle.declareAndGetState(defaultScrollState);
    state.parentH = parentBounds.h;

    gui.currentElement.bounds.x = parentBounds.x;
    gui.currentElement.bounds.y = parentBounds.y - state.offsetY;
    gui.currentElement.bounds.w = parentBounds.w;
    if (state.drawY) {
        gui.currentElement.bounds.w -= SCROLLBAR_WIDTH;
    }
    gui.currentElement.bounds.h = 999999;
}

function endScrollRegion() {
    const state = scrollStateHandle.declareAndGetState(defaultScrollState);
    const { parentH, offsetY } = state;

    let childrenHeight: number = gui.currentElement.children[0]?.bounds.y || 0;
    const offsetPosY = gui.currentElement.bounds.y;

    for (const child of gui.currentElement.children) {
        if (child.layer === gui.currentElement.layer) {
            childrenHeight = Math.max(
                child.bounds.h + child.bounds.y - offsetPosY,
                childrenHeight,
            );
        }
    }

    childrenHeight = Math.max(childrenHeight, parentH);

    gui.currentElement.bounds.y += offsetY;
    gui.currentElement.bounds.h = parentH;
    gui.endElement(); // CONTENT

    const percentOfContentOnScreenY = parentH / childrenHeight;
    const offscreenContentHeight = childrenHeight - parentH;
    const percentScrolledY = offscreenContentHeight
        ? offsetY / offscreenContentHeight
        : 0;
    const scrollbarHeight = parentH * percentOfContentOnScreenY;
    const scrollbarOffsetY = (parentH - scrollbarHeight) * percentScrolledY;
    const parentBounds = gui.currentElement.bounds;

    if (state.drawY) {
        gui.beginElement('scrollY');
        gui.currentElement.bounds.x = parentBounds.x + parentBounds.w - SCROLLBAR_WIDTH;
        gui.currentElement.bounds.y = parentBounds.y + scrollbarOffsetY;
        gui.currentElement.bounds.w = SCROLLBAR_WIDTH;
        gui.currentElement.bounds.h = scrollbarHeight;

        const { x, y, w, h } = gui.currentElement.bounds;
        gui.drawContext.setFillStyle('#EEEEEE');
        gui.drawContext.setStrokeStyle('#000000');
        gui.drawContext.fillRect(x, y, w, h);
        gui.drawContext.strokeRect(x, y, w, h);

        if (gui.mouse.hoversElement() && gui.mouse.isM1Dragged()) {
            if (percentOfContentOnScreenY < 1) {
                const deltaPercentY = (gui.mouse.dragY / (parentH - scrollbarHeight));
                const deltaOffsetY = deltaPercentY * (childrenHeight - parentH);

                state.offsetY += deltaOffsetY;
                state.offsetY = Math.max(0, state.offsetY);
                state.offsetY = Math.min(childrenHeight - parentH, state.offsetY);
            }
        }
        gui.endElement();
    }

    state.drawY = percentOfContentOnScreenY < 1;
    gui.endElement(); // CONTAINER
}

function setupCanvas() {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (!canvas) {
        throw new Error('No canvas');
    }
    const context = canvas.getContext('2d');
    if (!context) {
        throw new Error('No canvas context');
    }

    return { canvas, context };
}

function resetCanvas(context: CanvasRenderingContext2D, zoom: number = 1) {
    const canvas = context.canvas;

    canvas.width = canvas.clientWidth / zoom;
    canvas.height = canvas.clientHeight / zoom;

    context.clearRect(0, 0, canvas.width, canvas.height);
}

run(main);
