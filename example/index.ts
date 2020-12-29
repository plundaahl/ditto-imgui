import { run } from './runner';
import { theme, font } from './config';
import { setupCanvas, resetCanvas } from './util';
import { StyledDittoContextImpl } from '../src/StyledDittoImGui';
import { testApp as runApp } from './apps';

const { canvas, context } = setupCanvas();
const gui = new StyledDittoContextImpl(canvas, theme, font);

function main() {
    resetCanvas(context);
    runApp(gui);
    gui.render();
}

run(main);
