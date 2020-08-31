import { Context as window } from '../Context';
import { createBindFn, BindFn } from '../Bind';

interface WindowState {
    x: BindFn<number>,
    y: BindFn<number>,
    w: BindFn<number>,
    h: BindFn<number>,
}

export function initState(args: {
    x?: number,
    y?: number,
    w?: number,
    h?: number,
}): WindowState {
    return {
        x: createBindFn(args.x || 0),
        y: createBindFn(args.y || 0),
        w: createBindFn(args.w || 150),
        h: createBindFn(args.h || 80),
    }
}

export function begin(
    context: window,
    state: WindowState,
    title: string,
): void {
    const x = state.x();
    const y = state.y();
    const w = state.w();
    const h = state.h();

    const { draw } = context;

    context.declareElement(x, y, w, h);
    const titleHeight = draw.measureText(title).height;

    draw.save();

    draw.translate(x, y + titleHeight);

    draw.setFillStyle('#00FFCC');
    draw.fillRect(0, -titleHeight, w, titleHeight);
    draw.setFillStyle('#000000');
    draw.drawText(title, 0, -titleHeight);

    draw.setFillStyle('#bbbbbb');
    draw.fillRect(0, 0, w, h);

    draw.beginPath();
    draw.rect(0, 0, w, h);
    draw.clip();

    if (context.curElement.isActive()) {
        state.x(x + context.mouse.getDragX());
        state.y(y + context.mouse.getDragY());
    }
}

export function end(
    context: window,
): void {
    context.draw.restore();
}
