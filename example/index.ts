import { run } from './runner';
import { setupCanvas, resetCanvas } from './util';
import * as DittoImGUI from '../src/core';
import { button, panel, scrollRegion } from './widgets';

const { canvas, context } = setupCanvas();
DittoImGUI.createContext(canvas);

const gui = DittoImGUI.getContext();
let dummyIds: number[] = [0, 1, 2, 3, 4, 5];
let action: 'NEXT' | 'PREV' | undefined;

function main() {
    resetCanvas(context);

    if (action === 'NEXT') {
        gui.focus.incrementFocus();
    } else if (action === 'PREV') {
        gui.focus.decrementFocus();
    }
    action = undefined;

    panel.begin('Control Panel', 50, 50, 100, 100);
    if (button('Next')) {
        action = 'NEXT';
    }
    if (button('Prev')) {
        action = 'PREV';
    }
    panel.end();

    panel.begin('Display Panel', 250, 50, 100, 300);
    for (let i = 0; i < dummyIds.length; i++) {
        const id = dummyIds[i];
        button(`Element ${id}`);
    }
    panel.end();

    gui.render();
}

run(main);
