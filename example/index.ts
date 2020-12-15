import { run } from './runner';
import { theme, boxSize, font } from './config';
import { setupCanvas, resetCanvas } from './util';
import { StyledDittoContextImpl } from '../src/StyledDittoImGui';
import { containerPlayground as runApp } from './apps';

const { canvas, context } = setupCanvas();
const gui = new StyledDittoContextImpl(canvas, theme, boxSize, font);

function main() {
    resetCanvas(context);
    runApp(gui);
    gui.render();
}

run(main);
