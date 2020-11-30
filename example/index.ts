import { run } from './runner';
import { theme, boxSize, font } from './config';
import { setupCanvas, resetCanvas } from './util';
import { StyledDittoContextImpl } from '../src/StyledDittoImGui';
import { panel, slider } from './widgets';

const { canvas, context } = setupCanvas();
const gui = new StyledDittoContextImpl(canvas, theme, boxSize, font);

let number = 50;
const numberBinding = (v = number) => number = v;

function main() {
    resetCanvas(context);

    panel.begin(gui, 'Control Panel', 50, 50, 400, 400);
    slider(gui, 'a slider', numberBinding, 0, 100);
    panel.end(gui);

    gui.render();
}

run(main);
