import { run } from './runner';
import { theme, boxSize, font } from './config';
import { setupCanvas, resetCanvas } from './util';
import { StyledDittoContextImpl } from '../src/StyledDittoImGui';
import { button, panel, slider, editableText } from './widgets';
import Color from '../src/lib/Color';

const { canvas, context } = setupCanvas();
const gui = new StyledDittoContextImpl(canvas, theme, boxSize, font);

const color = new Color();
const hue = (_ = color.h) => color.h = _;
const sat = (_ = color.s) => color.s = _;
const lum = (_ = color.l) => color.l = _;
const red = (_ = color.r) => color.r = _;
const grn = (_ = color.g) => color.g = _;
const blu = (_ = color.b) => color.b = _;

function main() {
    resetCanvas(context);

    panel.begin(gui, 'Control Panel', 50, 50, 300, 400);
    slider(gui, 'Hue', hue, 0, 360, Math.round);
    slider(gui, 'Saturation', sat, 0, 1);
    slider(gui, 'Luma', lum, 0, 1);
    slider(gui, 'Red', red, 0, 255, Math.round);
    slider(gui, 'Green', grn, 0, 255, Math.round);
    slider(gui, 'Blue', blu, 0, 255, Math.round);
    panel.end(gui);

    panel.begin(gui, 'Output', 350, 50, 75, 100);
    gui.draw.setFillStyle(color.toHexString());
    const { x, y, w, h } = gui.bounds.getElementBounds();
    gui.draw.fillRect(x, y, w, h);
    panel.end(gui);

    gui.render();
}

run(main);
