import { Context } from '../Context';
import { WindowState } from './window';

const stateStack: WindowState[] = [];

export function begin(
    context: Context,
    state: WindowState,
    title: string,
): void {
    stateStack.push(state);

    const x = state.x();
    const y = state.y();
    const w = state.w();
    const expanded = state.expanded();

    const { draw } = context;
    const titleHeight = draw.measureText(title).height;

    context.beginElement(x, y, w, titleHeight);

    draw.setFillStyle(context.curElement.isHot() ? '#0055aa' : '#00aa55');
    draw.fillRect(0, 0, w, titleHeight);
    draw.setFillStyle('#ffffff');
    draw.drawText(title, 0, 0);

    context.beginElement(0, titleHeight, w, state.h()); // contents

    if (!expanded) {
        context.children.setShouldDraw(false);
    }
}

export function end(
    context: Context,
): void {
    const state = stateStack.pop();
    if (!state) {
        throw new Error('mismatched number of calls to window #begin and #end');
    }

    context.endElement(); // contents

    const x = state.x();
    const y = state.y();

    if (context.curElement.isActive()) {
        state.x(x + context.mouse.getDragX());
        state.y(y + context.mouse.getDragY());
    }

    context.endElement();
}
