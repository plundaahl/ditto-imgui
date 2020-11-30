import { FOCUSABLE } from '../../src/DittoImGui';
import { StyledDittoContext } from '../../src/StyledDittoImGui';

export function beginTitleBar(gui: StyledDittoContext, title: string) {
    const borderWidth = gui.boxSize.getBorderWidth();
    const borderWidthX2 = borderWidth * 2;
    const padding = gui.boxSize.getPadding();

    const { x: parentX, y: parentY, w: parentW } = gui.bounds.getElementBounds();

    const isWindowFocused = gui.focus.isElementFocusable() && gui.focus.isElementFocused();
    const isChildFocused = gui.focus.isChildFocused();

    gui.beginElement('titlebar', FOCUSABLE);

    const bounds = gui.bounds.getElementBounds();
    bounds.x = parentX + borderWidth;
    bounds.y = parentY + borderWidth;
    bounds.w = parentW - borderWidthX2;
    bounds.h = padding + padding + gui.draw.measureText('M').height;
    const { x, y, w, h } = bounds;

    const region = 'titlebar';
    const mode = (isChildFocused || isWindowFocused) ? 'focused' : 'idle';

    gui.draw.save();
    // background
    gui.draw.setFillStyle(gui.theme.getColor(region, mode, 'bg'));
    gui.draw.fillRect(x, y, w, h);

    // title text
    gui.draw.setFillStyle(gui.theme.getColor(region, mode, 'detail'));
    gui.draw.drawText(title, x + padding, y + padding);
    gui.draw.restore();

    if (gui.controller.isElementInteracted()) {
        gui.focus.focusElement();
    }
}

export function endTitleBar(gui: StyledDittoContext) {
    gui.endElement();
}
