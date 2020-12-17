import { StyledDittoContext, RegionType } from '../../src/StyledDittoImGui';
import { FOCUSABLE } from '../../src/DittoImGui';
import { extBoxBevelled } from './box';

export function button(
    gui: StyledDittoContext,
    buttonText: string,
    region: RegionType = 'controlStd',
) {
    const border = gui.boxSize.getBorderWidth();
    const padding = gui.boxSize.getPadding();
    const borderAndPadding = border + padding;

    extBoxBevelled.begin(gui, 'box');

    gui.draw.setFont(gui.font.getFont(region, 'idle'));
    gui.bounds.getElementBounds().h = gui.draw.measureText('M').height
        + ((borderAndPadding) * 2);

    gui.beginElement('text', FOCUSABLE);
    const bounds = gui.bounds.getElementBounds();
    const parentBounds = gui.bounds.getParentBounds();
    if (!parentBounds) {
        throw new Error();
    }

    bounds.x = parentBounds.x;
    bounds.y = parentBounds.y;
    bounds.w = parentBounds.w;
    bounds.h = parentBounds.h;

    const isTriggered = gui.controller.isElementTriggered();
    const isInteracted = gui.controller.isElementInteracted();
    const isFocused = gui.focus.isElementFocused();

    if (isInteracted) {
        gui.focus.focusElement();
    }

    const mode = isTriggered || gui.controller.isElementReadied()
        ? 'active'
        : isFocused
            ? 'focused'
            : 'idle';

    const { x, y } = gui.bounds.getElementBounds();

    gui.draw.setFillStyle(gui.theme.getColor(region, mode, 'detail'));
    gui.draw.drawText(buttonText, x + borderAndPadding, y + borderAndPadding);

    gui.endElement();
    extBoxBevelled.end(gui, region, mode);
    return isTriggered;
}
