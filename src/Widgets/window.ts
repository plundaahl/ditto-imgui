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

let states: WindowState[] = [];

export function begin(
    context: window,
    state: WindowState,
    title: string,
): void {
    const { x, y, w, h } = state;
    const { draw } = context;

    states.push(state);
    context.beginWindow(title);
    context.window.setBoundingBox(x, y, w, h);
    titlebar.begin(context, state, title);

    if (!state.isOpen) {
        return;
    }

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
    const state = states.pop();
    if (state?.isOpen) {
        context.endElement();
    }
    titlebar.end(context);
    context.endWindow();
}
