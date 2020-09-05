import { Context as window } from '../Context';
import { createBindFn, BindFn } from '../lib/bind';
import * as titlebar from './titlebar';

export interface WindowState {
    x: number,
    y: number,
    w: number,
    h: number,
    isOpen: boolean,
}

export function initState(args: {
    x?: number,
    y?: number,
    w?: number,
    h?: number,
    isOpen?: boolean,
}): WindowState {
    return {
        x: 0,
        y: 0,
        w: 150,
        h: 80,
        isOpen: true,
    }
}

export function begin(
    context: window,
    state: WindowState,
    title: string,
): void {
    context.beginWindow(title, state);
    titlebar.begin(context, state, title);

    const w = state.w;
    const h = state.h;

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
    context.endWindow();
}
