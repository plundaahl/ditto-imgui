import { getContext, DittoContext, FOCUSABLE } from '../../src/DittoImGui';

let gui: DittoContext;

function init() {
    if (gui) {
        return;
    }
    gui = getContext();
}


export function button(buttonText: string) {
    init();

    gui.beginElement(buttonText, FOCUSABLE);

    gui.bounds.getElementBounds().h = 30;

    const { x, y, w, h } = gui.bounds.getElementBounds();
    const isTriggered = gui.controller.isElementTriggered();

    if (gui.controller.isElementReadied()) {
        gui.focus.focusElement();
    }

    if (isTriggered) {
        gui.draw.setFillStyle('#FF0000');
    } else if (gui.focus.isElementFocused()) {
        gui.draw.setFillStyle('#AAFFAA');
    } else {
        gui.draw.setFillStyle('#EEEEEE');
    }
    gui.draw.setStrokeStyle('#000000');
    gui.draw.fillRect(x, y, w, h);

    gui.draw.strokeRect(x, y, w, h);

    gui.draw.setFillStyle('#000000');
    gui.draw.drawText(buttonText, x + 10, y + 10);

    gui.endElement();
    return isTriggered;
}
