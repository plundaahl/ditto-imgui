import { Context as window } from '../Context';
import { createBindFn, BindFn } from '../Bind';
import * as titlebar from './titlebar';

export interface WindowState {
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
    titlebar.begin(context, state, title);

    const w = state.w();
    const h = state.h();

    const { draw } = context;

    context.beginElement(0, 0, w, h);

    draw.setFillStyle('#bbbbbb');
    draw.fillRect(0, 0, w, h);

    draw.beginPath();
    draw.rect(0, 0, w, h);
    draw.clip();
}

export function end(
    context: window,
): void {
    context.endElement();
    titlebar.end(context);
}
