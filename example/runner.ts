export function run(
    loopFn: () => void,
) {
    let run: boolean = true;

    const loop = (time: number) => {
        loopFn();
        run && requestAnimationFrame(loop);    
    }

    loop(0);

    return { kill: () => run = false };
}


function getCanvasContext(canvasId: string): CanvasRenderingContext2D {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) {
        throw new Error('No canvas');
    }

    const context = canvas.getContext('2d');
    if (!context) {
        throw new Error('No context');
    }

    return context;
}


function resetCanvas(context: CanvasRenderingContext2D, zoom: number = 1) {
    const canvas = context.canvas;

    canvas.width = canvas.clientWidth / zoom;
    canvas.height = canvas.clientHeight / zoom;

    context.clearRect(0, 0, canvas.width, canvas.height);
}

