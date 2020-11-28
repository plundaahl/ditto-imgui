import { run } from './runner';
import { setupCanvas, resetCanvas } from './util';
import * as DittoImGUI from '../src/DittoImGui';
import { button, panel, scrollRegion, editableText } from './widgets';

const { canvas, context } = setupCanvas();
const gui = DittoImGUI.createContext(canvas);
let nextId: number = 6;
let dummyIds: number[] = [0, 1, 2, 3, 4, 5];

(window as any).sampleText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

const textBinding = (t = (window as any).sampleText) => (window as any).sampleText = t;
(window as any).panelWidth = 400;

function main() {
    resetCanvas(context);

    panel.begin(gui, 'Control Panel', 50, 50, (window as any).panelWidth, 400);
    if (button(gui, 'add')) {
        dummyIds.push(nextId++);
    }
    editableText(gui, 'edit', textBinding, true, true);
    panel.end(gui);

    panel.begin(gui, 'Display Panel', 250, 600, 100, 300);
    scrollRegion.begin(gui, 'somekey');
    for (let i = 0; i < dummyIds.length; i++) {
        const id = dummyIds[i];
        if (button(gui, `Element ${id}`)) {
            dummyIds = dummyIds.filter(e => e !== id);
        }
    }
    scrollRegion.end(gui);
    panel.end(gui);
    gui.render();
}

run(main);
