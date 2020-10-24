import { getContext, DittoContext } from '../../src/core';
import { StateHandle } from '../../src/core/ServiceManager/services/StateService';

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

    const parentBounds = gui.element.bounds;

    gui.beginElement(key); // CONTAINER
    gui.element.bounds.x = parentBounds.x;
    gui.element.bounds.y = parentBounds.y;
    gui.element.bounds.w = parentBounds.w;
    gui.element.bounds.h = parentBounds.h;

    gui.beginElement('content'); // CONTENT
    const state = stateHandle.declareAndGetState(defaultScrollState);
    state.parentH = parentBounds.h;

    gui.element.bounds.x = parentBounds.x;
    gui.element.bounds.y = parentBounds.y - state.offsetY;
    gui.element.bounds.w = parentBounds.w;
    if (state.drawY) {
        gui.element.bounds.w -= SCROLLBAR_WIDTH;
    }
    gui.element.bounds.h = 999999;
}

function endScrollRegion() {
    const state = stateHandle.declareAndGetState(defaultScrollState);
    const { parentH, offsetY } = state;

    let childrenHeight: number = gui.element.children[0]?.bounds.y || 0;
    const offsetPosY = gui.element.bounds.y;

    for (const child of gui.element.children) {
        if (child.layer === gui.element.layer) {
            childrenHeight = Math.max(
                child.bounds.h + child.bounds.y - offsetPosY,
                childrenHeight,
            );
        }
    }

    childrenHeight = Math.max(childrenHeight, parentH);

    gui.element.bounds.y += offsetY;
    gui.element.bounds.h = parentH;
    gui.endElement(); // CONTENT

    const percentOfContentOnScreenY = parentH / childrenHeight;
    const offscreenContentHeight = childrenHeight - parentH;
    const percentScrolledY = offscreenContentHeight
        ? offsetY / offscreenContentHeight
        : 0;
    const scrollbarHeight = parentH * percentOfContentOnScreenY;
    const scrollbarOffsetY = (parentH - scrollbarHeight) * percentScrolledY;
    const parentBounds = gui.element.bounds;

    if (state.drawY) {
        gui.beginElement('scrollY');
        gui.element.bounds.x = parentBounds.x + parentBounds.w - SCROLLBAR_WIDTH;
        gui.element.bounds.y = parentBounds.y + scrollbarOffsetY;
        gui.element.bounds.w = SCROLLBAR_WIDTH;
        gui.element.bounds.h = scrollbarHeight;

        const { x, y, w, h } = gui.element.bounds;
        gui.draw.setFillStyle('#EEEEEE');
        gui.draw.setStrokeStyle('#000000');
        gui.draw.fillRect(x, y, w, h);
        gui.draw.strokeRect(x, y, w, h);

        if (gui.action.isElementDragged()) {
            if (percentOfContentOnScreenY < 1) {
                const deltaPercentY = (gui.action.getDragY() / (parentH - scrollbarHeight));
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
