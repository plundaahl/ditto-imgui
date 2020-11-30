import { run } from './runner';
import { theme, boxSize, font } from './config';
import { setupCanvas, resetCanvas } from './util';
import { StyledDittoContextImpl } from '../src/StyledDittoImGui';
import { button, panel, editableText } from './widgets';
import Color from '../src/lib/Color';

const { canvas, context } = setupCanvas();
const gui = new StyledDittoContextImpl(canvas, theme, boxSize, font);

const color = Color.fromHexString('#BB0000');

let text = "foo bar baz foo bar baz foo bar baz foo bar baz foo bar baz foo bar baz foo bar baz foo bar baz foo bar baz foo bar baz foo bar baz foo bar baz foo bar baz foo bar baz ";

function main() {
    resetCanvas(context);

    panel.begin(gui, 'Control Panel', 50, 50, 400, 400);
    if (button(gui, 'lighten')) { color.lighten(0.1); }
    if (button(gui, 'darken')) { color.darken(0.1); }
    panel.end(gui);

    panel.begin(gui, 'Output Panel', 50, 650, 200, 200);
    editableText(gui, 'sometext', (t = text) => text = t, true, true);
    panel.end(gui);

    gui.render();
}

run(main);
