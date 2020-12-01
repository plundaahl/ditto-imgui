import { run } from './runner';
import { theme, boxSize, font } from './config';
import { setupCanvas, resetCanvas } from './util';
import { StyledDittoContextImpl } from '../src/StyledDittoImGui';
import { panel, colorSwatchEditable } from './widgets';
import Color from '../src/lib/Color';

const { canvas, context } = setupCanvas();
const gui = new StyledDittoContextImpl(canvas, theme, boxSize, font);

const color = new Color();
const color2 = new Color();

function main() {
    resetCanvas(context);

    panel.begin(gui, 'Control Panel', 50, 50, 300, 400);
    colorSwatchEditable(gui, 'color', color);
    colorSwatchEditable(gui, 'color2', color2);
    panel.end(gui);

    gui.render();
}

run(main);
