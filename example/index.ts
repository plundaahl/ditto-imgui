import gui from '../src';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
if (!canvas) {
    throw new Error('No canvas');
}

const context = canvas.getContext('2d');
if (!context) {
    throw new Error('No context');
}

const zoom = 1;
const dc = new gui.DrawContext(canvas);
let isVisible: boolean = false;

let b2x = 20;
let b2y = 70;

function main() {
    canvas.width = canvas.clientWidth / zoom;
    canvas.height = canvas.clientHeight / zoom;
    dc.clearRect(0, 0, canvas.width, canvas.height);

    if (gui.button(dc, "Foo!", 20, 20)) {
        isVisible = !isVisible;
    }

    if (isVisible) {
        gui.button(dc, "Bar!", b2x, b2y);
        if (dc.curElement.isActive()) {
            b2x += dc.mouse.getDragX();
            b2y += dc.mouse.getDragY();
        }
    }

    dc.render(context as CanvasRenderingContext2D);
}

function loop(time: number) {
    main();
    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
