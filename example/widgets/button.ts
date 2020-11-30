import { StyledDittoContext } from '../../src/StyledDittoImGui';
import { FOCUSABLE } from '../../src/DittoImGui';
import { bevelBox } from './bevelBox';

export function button(gui: StyledDittoContext, buttonText: string) {
    gui.beginElement(buttonText, FOCUSABLE);

    gui.bounds.getElementBounds().h = 30;

    const { x, y, w, h } = gui.bounds.getElementBounds();
    const isTriggered = gui.controller.isElementTriggered();
    const isInteracted = gui.controller.isElementInteracted();

    if (gui.controller.isElementReadied()) {
        gui.focus.focusElement();
    }

    const region = 'controlStd';
    const mode = isTriggered ? 'active' : 'idle';
    bevelBox(gui, x, y, w, h, region, mode, isInteracted);

    // text
    gui.draw.setFillStyle(gui.theme.getColor(region, mode, 'detail'));
    gui.draw.drawText(buttonText, x + 10, y + 10);

    gui.endElement();
    return isTriggered;
}
