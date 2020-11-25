import { getContext, DittoContext } from '../../src/DittoImGui';
import { StateHandle } from '../../src/DittoImGui/services/StateService';

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

    if (gui.controller.isElementHighlighted()) {
        if (gui.controller.isElementDragged()) {
            state.x += gui.controller.getDragX();
            state.y += gui.controller.getDragY();
        }
    }

    if (gui.controller.isElementInteracted() || gui.controller.isChildInteracted()) {
        gui.layer.bringLayerToFront();
    }

    const bounds = gui.bounds.getElementBounds();
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
