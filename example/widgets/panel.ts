import { getContext, DittoContext } from '../../src/core';
import { StateHandle } from '../../src/core/ServiceManager/services/StateService';

interface PanelState {
    x: number,
    y: number,
}

let gui: DittoContext;
let panelStateHandle: StateHandle<PanelState>;

function init() {
    if (gui || panelStateHandle) {
        return;
    }

    gui = getContext();
    panelStateHandle = gui.state.createHandle<{ x: number, y: number }>('panel');
}

function beginPanel(key: string, x: number, y: number, w: number, h: number) {
    init();

    gui.beginLayer(key);

    const state = panelStateHandle.declareAndGetState({ x, y });

    if (gui.action.isElementHighlighted()) {
        if (gui.action.isElementDragged()) {
            state.x += gui.action.getDragX();
            state.y += gui.action.getDragY();
        }
    }

    if (gui.action.isElementInteracted() || gui.action.isChildInteracted()) {
        gui.layer.bringToFront();
    }

    const bounds = gui.element.bounds;
    bounds.x = state.x;
    bounds.y = state.y;
    bounds.w = w;
    bounds.h = h;

    gui.draw.setFillStyle('#DDDDDD');
    gui.draw.fillRect(state.x, state.y, w, h);

    gui.draw.setStrokeStyle('#000000');
    gui.draw.strokeRect(state.x, state.y, w, h);

    gui.draw.beginPath();
    gui.draw.rect(state.x + 1, state.y + 1, w - 2, h - 2);
    gui.draw.clip();
}

function endPanel() {
    gui.endLayer();
}

export const panel = {
    begin: beginPanel,
    end: endPanel,
};