import { run } from './runner';
import { theme, boxSize, font } from './config';
import { setupCanvas, resetCanvas } from './util';
import { StyledDittoContextImpl } from '../src/StyledDittoImGui';
import { panel, colorSwatchEditable, containerCollapsable } from './widgets';
import Color from '../src/lib/Color';

const { canvas, context } = setupCanvas();
const gui = new StyledDittoContextImpl(canvas, theme, boxSize, font);

const color = new Color();
const color2 = new Color();

function main() {
    resetCanvas(context);

    panel.begin(gui, 'Control Panel', 50, 50, 300, 400);

    if (containerCollapsable.begin(gui, 'hithere')) {
        if (containerCollapsable.begin(gui, 'byethere')) {
            colorSwatchEditable(gui, 'color', color);
        }
        containerCollapsable.end(gui);
    }
    containerCollapsable.end(gui);

    if (containerCollapsable.begin(gui, 'sup')) {
        colorSwatchEditable(gui, 'color2', color2);
    }
    containerCollapsable.end(gui);

    panel.end(gui);

    gui.render();
}

run(main);
