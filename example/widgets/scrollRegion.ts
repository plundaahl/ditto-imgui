import { getContext, GuiContext } from '../../src/core';
import { StateHandle } from '../../src/core/systems/StateManager';

interface ScrollState {
    offsetY: number,
    parentH: number,
    drawY: boolean,
};

let gui: GuiContext;
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

    const parentBounds = gui.currentElement.bounds;

    gui.beginElement(key); // CONTAINER
    gui.currentElement.bounds.x = parentBounds.x;
    gui.currentElement.bounds.y = parentBounds.y;
    gui.currentElement.bounds.w = parentBounds.w;
    gui.currentElement.bounds.h = parentBounds.h;

    gui.beginElement('content'); // CONTENT
    const state = stateHandle.declareAndGetState(defaultScrollState);
    state.parentH = parentBounds.h;

    gui.currentElement.bounds.x = parentBounds.x;
    gui.currentElement.bounds.y = parentBounds.y - state.offsetY;
    gui.currentElement.bounds.w = parentBounds.w;
    if (state.drawY) {
        gui.currentElement.bounds.w -= SCROLLBAR_WIDTH;
    }
    gui.currentElement.bounds.h = 999999;
}

function endScrollRegion() {
    const state = stateHandle.declareAndGetState(defaultScrollState);
    const { parentH, offsetY } = state;

    let childrenHeight: number = gui.currentElement.children[0]?.bounds.y || 0;
    const offsetPosY = gui.currentElement.bounds.y;

    for (const child of gui.currentElement.children) {
        if (child.layer === gui.currentElement.layer) {
            childrenHeight = Math.max(
                child.bounds.h + child.bounds.y - offsetPosY,
                childrenHeight,
            );
        }
    }

    childrenHeight = Math.max(childrenHeight, parentH);

    gui.currentElement.bounds.y += offsetY;
    gui.currentElement.bounds.h = parentH;
    gui.endElement(); // CONTENT

    const percentOfContentOnScreenY = parentH / childrenHeight;
    const offscreenContentHeight = childrenHeight - parentH;
    const percentScrolledY = offscreenContentHeight
        ? offsetY / offscreenContentHeight
        : 0;
    const scrollbarHeight = parentH * percentOfContentOnScreenY;
    const scrollbarOffsetY = (parentH - scrollbarHeight) * percentScrolledY;
    const parentBounds = gui.currentElement.bounds;

    if (state.drawY) {
        gui.beginElement('scrollY');
        gui.currentElement.bounds.x = parentBounds.x + parentBounds.w - SCROLLBAR_WIDTH;
        gui.currentElement.bounds.y = parentBounds.y + scrollbarOffsetY;
        gui.currentElement.bounds.w = SCROLLBAR_WIDTH;
        gui.currentElement.bounds.h = scrollbarHeight;

        const { x, y, w, h } = gui.currentElement.bounds;
        gui.drawContext.setFillStyle('#EEEEEE');
        gui.drawContext.setStrokeStyle('#000000');
        gui.drawContext.fillRect(x, y, w, h);
        gui.drawContext.strokeRect(x, y, w, h);

        if (gui.action.isElementDragged()) {
            if (percentOfContentOnScreenY < 1) {
                const deltaPercentY = (gui.action.getDragX() / (parentH - scrollbarHeight));
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
