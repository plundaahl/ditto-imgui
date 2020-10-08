import { getContext, GuiContext } from '../../src/core';

let gui: GuiContext;

function init() {
    if (gui) {
        return;
    }
    gui = getContext();
}


export function button(buttonText: string) {
    init();

    gui.beginElement(buttonText);

    gui.currentElement.bounds.h = 30;

    const { x, y, w, h } = gui.currentElement.bounds;
    const isClicked = gui.mouse.hoversElement() && gui.mouse.isM1Clicked();

    if (isClicked) {
        gui.drawContext.setFillStyle('#FF0000');
    } else if (gui.mouse.hoversElement()) {
        gui.drawContext.setFillStyle('#FFAAAA');
    } else {
        gui.drawContext.setFillStyle('#EEEEEE');
    }
    gui.drawContext.setStrokeStyle('#000000');
    gui.drawContext.fillRect(x, y, w, h);
    gui.drawContext.strokeRect(x, y, w, h);

    gui.drawContext.setFillStyle('#000000');
    gui.drawContext.drawText(buttonText, x + 10, y + 10);

    gui.endElement();
    return isClicked;
}

