import { run } from './runner';
import { setupCanvas, resetCanvas } from './util';
import * as DittoImGUI from '../src/core';
import { button, panel, scrollRegion, editableText } from './widgets';

const { canvas, context } = setupCanvas();
DittoImGUI.createContext(canvas);

const gui = DittoImGUI.getContext();
let nextId: number = 6;
let dummyIds: number[] = [0, 1, 2, 3, 4, 5];
let text: string = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

const textBinding = (t = text) => text = t;

function main() {
    resetCanvas(context);

    panel.begin('Control Panel', 50, 50, 500, 100);
    if (button('add')) {
        dummyIds.push(nextId++);
    }
    editableText('edit', textBinding, true);
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
