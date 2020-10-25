import { run } from './runner';
import { setupCanvas, resetCanvas } from './util';
import * as DittoImGUI from '../src/core';
import { button, panel, scrollRegion } from './widgets';

const { canvas, context } = setupCanvas();
DittoImGUI.createContext(canvas);

const gui = DittoImGUI.getContext();
let nextId: number = 6;
let dummyIds: number[] = [0, 1, 2, 3, 4, 5];

function main() {
    resetCanvas(context);

    panel.begin('Control Panel', 50, 50, 500, 100);
    if (button('add')) {
        dummyIds.push(nextId++);
    }
    {
        gui.beginElement('m1disp');
        gui.element.bounds.h = 50;
        const { x, y } = gui.element.bounds;
        gui.draw.setFillStyle('#000000');
        const item = (gui as any).focus.action;
        gui.draw.drawText(`${item}`, x, y);
        gui.endElement();
    }
    panel.end();

    panel.begin('Display Panel', 250, 200, 100, 300);
    scrollRegion.begin('somekey');
    for (let i = 0; i < dummyIds.length; i++) {
        const id = dummyIds[i];
        if (button(`Element ${id}`)) {
            dummyIds = dummyIds.filter(e => e !== id);
        }
    }
    scrollRegion.end();
    panel.end();
    gui.render();
}

run(main);
