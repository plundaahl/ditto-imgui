import { runOnCanvas } from './runner';

runOnCanvas(main, 'canvas');

function main(context: CanvasRenderingContext2D) {
    context.fillStyle = '#ff0000'
    context.fillRect(20, 20, 100, 100);
}
