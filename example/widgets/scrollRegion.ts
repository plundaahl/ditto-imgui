import { getContext, DittoContext } from '../../src/DittoImGui';
import { StateHandle } from '../../src/DittoImGui/services/StateService';

interface ScrollState {
    offsetY: number,
    parentH: number,
    drawY: boolean,
};

let gui: DittoContext;
let stateHandle: StateHandle<ScrollState>;
const SCROLLBAR_WIDTH = 15;
const defaultScrollState: ScrollState = {
    offsetY: 0,
    parentH: 0,
    drawY: false,
};

function init() {
    if (gui || stateHandle) {
        return;
    }
    gui = getContext();
    stateHandle = gui.state.createHandle<ScrollState>('scrollregion');
}

function beginScrollRegion(key: string) {
    init();

    const parentBounds = gui.element.getBounds();

    gui.beginElement(key); // CONTAINER
    const containerBounds = gui.element.getBounds();
    containerBounds.x = parentBounds.x;
    containerBounds.y = parentBounds.y;
    containerBounds.w = parentBounds.w;
    containerBounds.h = parentBounds.h;

    gui.beginElement('content'); // CONTENT
    const contentBounds = gui.element.getBounds();
    const state = stateHandle.declareAndGetState(defaultScrollState);
    state.parentH = parentBounds.h;

    contentBounds.x = parentBounds.x;
    contentBounds.y = parentBounds.y - state.offsetY;
    contentBounds.w = parentBounds.w;
    if (state.drawY) {
        contentBounds.w -= SCROLLBAR_WIDTH;
    }
    contentBounds.h = 999999;
}

function endScrollRegion() {
    const state = stateHandle.declareAndGetState(defaultScrollState);
    const { parentH, offsetY } = state;
    const bounds = gui.element.getBounds();

    const childrenHeight: number = gui.bounds.getChildBounds().h + (
        gui.bounds.getChildBounds().y - bounds.y
    );

    bounds.y += offsetY;
    bounds.h = parentH;
    gui.endElement(); // CONTENT

    const percentOfContentOnScreenY = parentH / childrenHeight;
    const offscreenContentHeight = childrenHeight - parentH;
    const percentScrolledY = offscreenContentHeight
        ? offsetY / offscreenContentHeight
        : 0;
    const scrollbarHeight = parentH * percentOfContentOnScreenY;
    const scrollbarOffsetY = (parentH - scrollbarHeight) * percentScrolledY;
    const parentBounds = gui.element.getBounds();

    if (state.drawY) {
        gui.beginElement('scrollY');
        const bounds = gui.element.getBounds();
        bounds.x = parentBounds.x + parentBounds.w - SCROLLBAR_WIDTH;
        bounds.y = parentBounds.y + scrollbarOffsetY;
        bounds.w = SCROLLBAR_WIDTH;
        bounds.h = scrollbarHeight;

        const { x, y, w, h } = bounds;
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
