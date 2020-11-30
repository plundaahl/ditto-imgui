import { StyledDittoContext } from '../../src/StyledDittoImGui';
import { FOCUSABLE } from '../../src/DittoImGui';
import { bevelBox } from './bevelBox';

export function button(gui: StyledDittoContext, buttonText: string) {
    const border = gui.boxSize.getBorderWidth();
    const padding = gui.boxSize.getPadding();

    gui.beginElement(buttonText, FOCUSABLE);
    gui.draw.setFont(gui.font.getFont('controlStd', 'idle'));
    gui.bounds.getElementBounds().h = gui.draw.measureText('M').height
        + border + border
        + padding + padding;

    const { x, y, w, h } = gui.bounds.getElementBounds();
    const isTriggered = gui.controller.isElementTriggered();
    const isInteracted = gui.controller.isElementInteracted();
    const isFocused = gui.focus.isElementFocused();

    if (isInteracted) {
        gui.focus.focusElement();
    }

    const region = 'controlStd';
    const mode = isTriggered || gui.controller.isElementReadied()
        ? 'active'
        : isFocused
            ? 'focused'
            : 'idle';
    bevelBox(gui, x, y, w, h, region, mode);

    // text
    gui.draw.setFillStyle(gui.theme.getColor(region, mode, 'detail'));
    gui.draw.drawText(buttonText, x + border + padding, y + border + padding);

    gui.endElement();
    return isTriggered;
}
