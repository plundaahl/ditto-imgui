import { StyledDittoContext } from '../../src/StyledDittoImGui';
import { FOCUSABLE } from '../../src/DittoImGui';

const BORDER_WIDTH = 2;
const BORDER_WIDTH_X2 = BORDER_WIDTH * 2;

export function button(gui: StyledDittoContext, buttonText: string) {
    gui.beginElement(buttonText, FOCUSABLE);

    gui.bounds.getElementBounds().h = 30;

    const { x, y, w, h } = gui.bounds.getElementBounds();
    const isTriggered = gui.controller.isElementTriggered();
    const isInteracted = gui.controller.isElementInteracted();
    const isFocused = gui.focus.isElementFocused();

    if (gui.controller.isElementReadied()) {
        gui.focus.focusElement();
    }

    const region = 'controlStd';
    const mode = isFocused || isTriggered
        ? 'active'
        : 'idle';

    // lower-right border
    gui.draw.setFillStyle(
        isInteracted
            ? gui.theme.getColor(region, mode, 'bgHighlight')
            : gui.theme.getColor(region, mode, 'bgLowlight')
    );
    gui.draw.fillRect(x, y, w, h);

    // upper-left border
    gui.draw.setFillStyle(
        isInteracted
            ? gui.theme.getColor(region, mode, 'bgLowlight')
            : gui.theme.getColor(region, mode, 'bgHighlight')
    );
    gui.draw.beginPath();
    gui.draw.moveTo(x, y + h);
    gui.draw.lineTo(x + BORDER_WIDTH, y + h - BORDER_WIDTH);
    gui.draw.lineTo(x + w - BORDER_WIDTH, y + BORDER_WIDTH);
    gui.draw.lineTo(x + w, y);
    gui.draw.lineTo(x, y);
    gui.draw.fill();

    // background
    gui.draw.setFillStyle(gui.theme.getColor(region, mode, 'bg'));
    gui.draw.fillRect(
        x + BORDER_WIDTH,
        y + BORDER_WIDTH,
        w - BORDER_WIDTH_X2,
        h - BORDER_WIDTH_X2,
    );

    // text
    gui.draw.setFillStyle(gui.theme.getColor(region, mode, 'detail'));
    gui.draw.drawText(buttonText, x + 10, y + 10);

    gui.endElement();
    return isTriggered;
}
