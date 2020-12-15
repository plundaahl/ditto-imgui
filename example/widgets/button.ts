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

    extBoxBevelled.begin(gui, 'box', FOCUSABLE);

    gui.draw.setFont(gui.font.getFont(region, 'idle'));
    gui.bounds.getElementBounds().h = gui.draw.measureText('M').height
        + border + border
        + padding + padding;

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
    gui.draw.drawText(buttonText, x + padding, y + padding);

    extBoxBevelled.end(gui, region, mode);
    return isTriggered;
}
