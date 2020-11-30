import { FOCUSABLE } from '../../src/DittoImGui';
import { StyledDittoContext } from '../../src/StyledDittoImGui';

export function beginTitleBar(gui: StyledDittoContext, title: string) {
    const borderWidth = gui.boxSize.getBorderWidth();
    const borderWidthX2 = borderWidth * 2;
    const padding = gui.boxSize.getPadding();

    const { x: parentX, y: parentY, w: parentW } = gui.bounds.getElementBounds();
    const isChildFocused = gui.focus.isChildFocused();
    const isWindowInteracted = gui.controller.isElementInteracted();

    gui.beginElement('titlebar', FOCUSABLE);
    gui.draw.save();
    gui.draw.setFont(gui.font.getFont('titlebar', 'idle'));

    const bounds = gui.bounds.getElementBounds();
    bounds.x = parentX + borderWidth;
    bounds.y = parentY + borderWidth;
    bounds.w = parentW - borderWidthX2;
    bounds.h = padding + padding + gui.draw.measureText('M').ascent;
    const { x, y, w, h } = bounds;

    const region = 'titlebar';
    const mode = isChildFocused ? 'focused' : 'idle';

    // background
    gui.draw.setFillStyle(gui.theme.getColor(region, mode, 'bg'));
    gui.draw.fillRect(x, y, w, h);

    // title text
    gui.draw.setFillStyle(gui.theme.getColor(region, mode, 'detail'));
    gui.draw.drawText(title, x + padding, y + padding);

    if (isWindowInteracted) {
        // gui.focus.focusElement();
    }

    gui.draw.restore();
}

export function endTitleBar(gui: StyledDittoContext) {
    gui.endElement();
}
