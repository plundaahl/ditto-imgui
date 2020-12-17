import { StyledDittoContext } from '../../src/StyledDittoImGui';
import { StateComponentKey } from '../../src/DittoImGui';
import { boxBevelled } from './box';

const SCROLLBAR_WIDTH = 15;
const stateKey = new StateComponentKey('example/scrollRegion', {
    offsetY: 0,
    parentH: 0,
    drawY: false,
    minHeight: 0,
});

function beginScrollRegion(
    gui: StyledDittoContext,
    key: string,
) {
    const parentBounds = gui.bounds.getElementBounds();

    gui.beginElement(key); // CONTAINER
    const containerBounds = gui.bounds.getElementBounds();
    containerBounds.x = parentBounds.x;
    containerBounds.y = parentBounds.y;
    containerBounds.w = parentBounds.w;
    containerBounds.h = parentBounds.h;

    gui.beginElement('content'); // CONTENT
    const contentBounds = gui.bounds.getElementBounds();
    const state = gui.state.getStateComponent(stateKey);
    state.parentH = parentBounds.h;

    contentBounds.x = parentBounds.x;
    contentBounds.y = parentBounds.y - state.offsetY;
    contentBounds.w = parentBounds.w;
    if (state.drawY) {
        contentBounds.w -= SCROLLBAR_WIDTH;
    }
    contentBounds.h = 999999;
}

function endScrollRegion(gui: StyledDittoContext) {
    const state = gui.state.getStateComponent(stateKey);
    const { parentH, offsetY } = state;
    const bounds = gui.bounds.getElementBounds();

    const topPadding = gui.bounds.getChildBounds().y - bounds.y;

    const childrenHeight: number = gui.bounds.getChildBounds().h + topPadding;

    bounds.y += offsetY;
    bounds.h = gui.bounds.getChildBounds().h + topPadding + topPadding;
    {
        const { x, y, w, h } = gui.bounds.getElementBounds();
        gui.draw.setStrokeStyle('red');
        gui.draw.strokeRect(x, y, w, h);
    }
    gui.endElement(); // CONTENT
    gui.bounds.getElementBounds().h = gui.bounds.getChildBounds().h;

    const percentOfContentOnScreenY = parentH / childrenHeight;
    const offscreenContentHeight = childrenHeight - parentH;
    const percentScrolledY = offscreenContentHeight
        ? offsetY / offscreenContentHeight
        : 0;
    const scrollbarHeight = parentH * percentOfContentOnScreenY;
    const scrollbarOffsetY = (parentH - scrollbarHeight) * percentScrolledY;
    const parentBounds = gui.bounds.getElementBounds();

    if (state.drawY) {
        gui.beginElement('scrollY');
        const bounds = gui.bounds.getElementBounds();
        bounds.x = parentBounds.x + parentBounds.w - SCROLLBAR_WIDTH;
        bounds.y = parentBounds.y + scrollbarOffsetY;
        bounds.w = SCROLLBAR_WIDTH;
        bounds.h = scrollbarHeight;

        const { x, y, w, h } = bounds;
        boxBevelled.begin(gui, x, y, w, h, 'controlStd', 'idle');
        gui.draw.setFillStyle('#EEEEEE');
        gui.draw.setStrokeStyle('#000000');
        gui.draw.fillRect(x, y, w, h);
        gui.draw.strokeRect(x, y, w, h);

        if (gui.controller.isElementDragged()) {
            if (percentOfContentOnScreenY < 1) {
                const deltaPercentY = (gui.controller.getDragY() / (parentH - scrollbarHeight));
                const deltaOffsetY = deltaPercentY * (childrenHeight - parentH);

                state.offsetY += deltaOffsetY;
                state.offsetY = Math.max(0, state.offsetY);
                state.offsetY = Math.min(childrenHeight - parentH, state.offsetY);
            }
        }
        gui.endElement();
    }

    state.drawY = percentOfContentOnScreenY < 1;
    gui.endElement(); // CONTAINER
}

export const scrollRegion = {
    begin: beginScrollRegion,
    end: endScrollRegion,
};
