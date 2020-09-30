import { run } from './runner';
import { createContext, getContext } from '../src/core';

const { canvas, context } = setupCanvas();
createContext(canvas);
const gui = getContext();

(window as any).gui = gui;

run(main);

function main() {
    resetCanvas(context);

    gui.beginLayer('otherlayer');
    {
        const bounds = gui.currentElement.bounds;
        bounds.x = 100;
        bounds.y = 100;
        bounds.w = 100;
        bounds.h = 100;
    }

    gui.beginElement('childelement');

    {
        const bounds = gui.currentElement.bounds;
        bounds.x = 100;
        bounds.y = 100;
        bounds.w = 100;
        bounds.h = 100;
    }


    gui.drawContext.setFillStyle('#FF0000');
    gui.drawContext.fillRect(100, 100, 100, 100);

    gui.endElement();
    gui.endLayer();

    gui.render();
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

