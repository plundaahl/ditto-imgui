import { run } from './runner';
import { createContext, getContext } from '../src/core';

const { canvas, context } = setupCanvas();
createContext(canvas);
const gui = getContext();

(window as any).gui = gui;

let nButtons: number = 0;

function main() {
    resetCanvas(context);

    beginPanel('Control Panel', 50, 50, 100, 100);
    if (button('Increment')) {
        nButtons++;
    }
    if (button('Decrement')) {
        nButtons = Math.max(nButtons - 1, 0);
    }
    endPanel();

    beginPanel('Display Panel', 250, 50, 100, 500);
    for (let i = 0; i < nButtons; i++) {
        button(`Button ${i}`);
    }
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
}

function endPanel() {
    gui.endLayer();
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
