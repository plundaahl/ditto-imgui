import { runOnCanvas } from './runner';
import { getContext, Context } from '../src/rework';

(window as any).data = initializeElements();
const guiCtx = getContext();
runOnCanvas(main, 'canvas');

function main(canvasContext: CanvasRenderingContext2D) {
    let rootElement: ElementDataTree = (window as any).data;
    drawElementTree(guiCtx, rootElement);
    guiCtx.render(canvasContext);
}

type ElementDataTree = {
    x: number,
    y: number,
    w: number,
    h: number,
    style: string,
    children?: ElementDataTree[]
}

function initializeElements(): ElementDataTree {
    const data: ElementDataTree = makeElement(20, 20, 100, 100, '#FF0000', {
        children: [
            makeElement(70, 80, 100, 100, '#8888FF'),
            makeElement(20, 100, 60, 60, '#bbbbbb'),
            makeElement(200, 10, 200, 150, '#ffffff'),
        ]
    });
    return data;
}

function drawElementTree(guiCtx: Context, element: ElementDataTree) {
    const {x, y, w, h} = element;

    guiCtx.beginElement();

    guiCtx.bounds.x = x;
    guiCtx.bounds.y = y;
    guiCtx.bounds.w = w;
    guiCtx.bounds.h = h;

    guiCtx.draw.setFillStyle(element.style);
    guiCtx.draw.fillRect(x, y, w, h);
    guiCtx.draw.setStrokeStyle('#000000');
    guiCtx.draw.strokeRect(x, y, w, h);

    if (element.children) {
        for (const child of element.children) {
            drawElementTree(guiCtx, child);
        }
    }

    guiCtx.endElement();
}

function makeElement(
    x: number,
    y: number,
    w: number,
    h: number,
    style: string,
    children: {
        children?: ElementDataTree[]
    } = {}
) {
    return { x, y, w, h, style, children: children.children || []}
}
