import { run } from './runner';
import { createContext, getContext } from '../src/core';

const { canvas, context } = setupCanvas();
createContext(canvas);
const gui = getContext();

(window as any).gui = gui;

function main() {
    resetCanvas(context);

    beginPanel('main', 50, 50, 100, 100);
    beginPanel('subpanel', 75, 75, 100, 100);
    beginPanel('subsubpanel', 90, 90, 120, 120);
    hoverableElement('foo', 10, 10, 100, 50);
    hoverableElement('bar', 10, 60, 100, 50);
    endPanel();
    endPanel();
    endPanel();

    gui.render();
}

function hoverableElement(key: string, x: number, y: number, w: number, h: number) {
    const parentBounds = gui.currentElement.bounds;

    gui.beginElement(key);
    const bounds = gui.currentElement.bounds;
    bounds.x = parentBounds.x + x;
    bounds.y = parentBounds.y + y;
    bounds.w = w;
    bounds.h = h;

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

    gui.drawContext.fillRect(bounds.x, bounds.y, w, h);
    gui.drawContext.setStrokeStyle('#000000');
    gui.drawContext.strokeRect(bounds.x, bounds.y, w, h);

    gui.endElement();
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

    if (gui.mouse.hoversElement()) {
        gui.drawContext.setStrokeStyle('#FF0000');
    } else if (gui.mouse.hoversChild()) {
        gui.drawContext.setStrokeStyle('#00FF00');
    } else if (gui.mouse.hoversFloatingChild()) {
        gui.drawContext.setStrokeStyle('#0000FF');
    } else {
        gui.drawContext.setStrokeStyle('#000000');
    }
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
