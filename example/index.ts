import { run } from './runner';
import { setupCanvas, resetCanvas } from './util';
import * as DittoImGUI from '../src/core';
import { button, panel, scrollRegion } from './widgets';

const { canvas, context } = setupCanvas();
DittoImGUI.createContext(canvas);

const gui = DittoImGUI.getContext();
let dummyIds: number[] = [];
let nextId: number = 0;

function main() {
    resetCanvas(context);

    panel.begin('Control Panel', 50, 50, 100, 100);
    if (button('Add Button')) {
        dummyIds.push(nextId++);
    }
    panel.begin('Some Other Panel', 75, 75, 100, 100);
    panel.end();
    panel.end();

    panel.begin('Display Panel', 250, 50, 100, 200);
    scrollRegion.begin('DisplayScroll');
    for (let i = 0; i < dummyIds.length; i++) {
        const id = dummyIds[i];
        if (button(`Remove ${id}`)) {
            dummyIds = dummyIds.filter(element => element !== id);
        }
    }
    scrollRegion.end();
    panel.end();

    gui.render();
}

run(main);
