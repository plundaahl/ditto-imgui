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
const dc = new gui.Context(canvas);
let isVisible: boolean = false;

const winState = gui.window.initState({
    x: 300,
    y: 50,
    w: 150,
    h: 80,
});

function main() {
    canvas.width = canvas.clientWidth / zoom;
    canvas.height = canvas.clientHeight / zoom;
    dc.draw.clearRect(0, 0, canvas.width, canvas.height);

    if (gui.button(dc, "Foo!", 20, 20)) {
        isVisible = !isVisible;
    }

    gui.window.begin(dc, winState, 'a window');
    if (isVisible) {
        if (gui.button(dc, 'thing', 20, 30)) {
            console.log('oh hai')
        }
    }
    gui.window.end(dc);

    dc.render();
}

function loop(time: number) {
    main();
    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
