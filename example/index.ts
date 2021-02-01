import { run } from './runner';
import { theme, font } from './config';
import { setupCanvas, resetCanvas } from './util';
import { StyledDittoContextImpl } from '../src/StyledDittoImGui';
import { testApp as runApp } from './apps';

const { canvas, context } = setupCanvas();
const gui = new StyledDittoContextImpl(canvas, theme, font);

const canvasMetrics = {
    w: canvas.width,
    h: canvas.height,
};

function main() {
    resetCanvas(context);

    canvasMetrics.w = canvas.width;
    canvasMetrics.h = canvas.height;

    runApp(gui, canvasMetrics);
    gui.render();
}

run(main);
