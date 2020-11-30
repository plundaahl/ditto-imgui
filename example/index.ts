import { run } from './runner';
import { theme, boxSize, font } from './config';
import { setupCanvas, resetCanvas } from './util';
import { StyledDittoContextImpl } from '../src/StyledDittoImGui';
import { button, panel, slider, editableText } from './widgets';

const { canvas, context } = setupCanvas();
const gui = new StyledDittoContextImpl(canvas, theme, boxSize, font);

let numA = 50;
let numB = 50;
let mode: string = 'add';

const numABinding = (v = numA) => numA = v;
const numBBinding = (v = numB) => numB = v;

function main() {
    resetCanvas(context);

    panel.begin(gui, 'Control Panel', 50, 50, 400, 400);
    slider(gui, 'A', numABinding, 0, 100, Math.round);
    slider(gui, 'B', numBBinding, 0, 100, Math.round);

    if (button(gui, 'add')) { mode = 'add'; }
    if (button(gui, 'subtract')) { mode = 'sub'; }
    if (button(gui, 'multiply')) { mode = 'mult'; }
    if (button(gui, 'divide')) { mode = 'div'; }

    let result: number;
    if (mode === 'add') { result = numA + numB; }
    if (mode === 'sub') { result = numA - numB; }
    if (mode === 'mult') { result = numA * numB; }
    if (mode === 'div') { result = numA / numB; }

    editableText(gui, 'output', () => result.toString());
    panel.end(gui);

    gui.render();
}

run(main);
