import { run } from './runner';
import { setupCanvas, resetCanvas } from './util';
import { createContext, getContext } from '../src/core';
import { button, panel, scrollRegion } from './widgets';

const { canvas, context } = setupCanvas();
createContext(canvas);

const gui = getContext();
let dummyIds: number[] = [];
let nextId: number = 0;

function main() {
    resetCanvas(context);

    panel.begin('Control Panel', 50, 50, 100, 100);
    if (button('Increment')) {
        dummyIds.push(nextId++);
    }
    panel.end();

    panel.begin('Display Panel', 250, 50, 100, 200);
    scrollRegion.begin('DisplayScroll');
    for (let i = 0; i < dummyIds.length; i++) {
        const id = dummyIds[i];
        if (button(`Button ${id}`)) {
            dummyIds = dummyIds.filter(element => element !== id);
        }
    }
    scrollRegion.end();
    panel.end();

    gui.render();
}

run(main);
