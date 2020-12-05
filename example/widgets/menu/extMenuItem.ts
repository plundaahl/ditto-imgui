import { StyledDittoContext } from '../../../src/StyledDittoImGui';
import { FOCUSABLE } from '../../../src/DittoImGui';

const region = 'controlStd';

function begin(
    gui: StyledDittoContext,
    key: string,
    flags: number = 0,
) {
    gui.beginElement(key, FOCUSABLE | flags);

    const isInFocusChain = gui.focus.isElementFocused()
        || gui.focus.isChildFocused()
        || gui.focus.isFloatingChildFocused();

    const mode = isInFocusChain ? 'focused' : 'idle';
    const padding = gui.boxSize.getPadding();
    const bounds = gui.bounds.getElementBounds();

    gui.draw.setFont(gui.font.getFont(region, mode));
    bounds.h = gui.draw.measureText(key).ascent + (padding * 2);
    const { x, y, w, h } = bounds;

    // background
    if (isInFocusChain) {
        gui.draw.setFillStyle(gui.theme.getColor(region, mode, 'bg'));
        gui.draw.fillRect(x, y, w, h);
    }

    // text
    gui.draw.setFillStyle(gui.theme.getColor(region, mode, 'detail'));
    gui.draw.drawText(key, x + padding, y + padding);

    // behavior
    if (gui.mouse.hoversElement()) {
        gui.focus.focusElement();
    }

    return isInFocusChain;
}

function end(
    gui: StyledDittoContext,
) {
    gui.endElement();
}

export const extMenuItem = { begin, end };
