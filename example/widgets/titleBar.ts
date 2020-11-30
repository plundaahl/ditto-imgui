import { FOCUSABLE } from '../../src/DittoImGui';
import { StyledDittoContext } from '../../src/StyledDittoImGui';

const BORDER_WIDTH = 2;
const BORDER_WIDTH_X2 = BORDER_WIDTH * 2;
const TITLE_BAR_HEIGHT = 25;
const PADDING = 7;

export function beginTitleBar(gui: StyledDittoContext, title: string) {
    const { x: parentX, y: parentY, w: parentW } = gui.bounds.getElementBounds();

    const isWindowFocused = gui.focus.isElementFocusable() && gui.focus.isElementFocused();
    const isChildFocused = gui.focus.isChildFocused();

    gui.beginElement('titlebar', FOCUSABLE);

    const bounds = gui.bounds.getElementBounds();
    bounds.x = parentX + BORDER_WIDTH;
    bounds.y = parentY + BORDER_WIDTH;
    bounds.w = parentW - BORDER_WIDTH_X2;
    bounds.h = TITLE_BAR_HEIGHT;
    const { x, y, w, h } = bounds;

    const region = 'titlebar';
    const mode = (isChildFocused || isWindowFocused) ? 'focused' : 'idle';

    gui.draw.save();
    // background
    gui.draw.setFillStyle(gui.theme.getColor(region, mode, 'bg'));
    gui.draw.fillRect(x, y, w, h);

    // title text
    gui.draw.setFillStyle(gui.theme.getColor(region, mode, 'detail'));
    gui.draw.setFont('courier 14px bold');
    gui.draw.drawText(title, x + PADDING, y + PADDING);
    gui.draw.restore();

    if (gui.controller.isElementInteracted()) {
        gui.focus.focusElement();
    }
}

export function endTitleBar(gui: StyledDittoContext) {
    gui.endElement();
}
