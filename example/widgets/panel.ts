import { getContext, GuiContext } from '../../src/core';
import { StateHandle } from '../../src/core/systems/StateManager';

interface PanelState {
    x: number,
    y: number,
}

let gui: GuiContext;
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

    if (gui.mouse.hoversElement()) {
        if (gui.mouse.isM1Dragged()) {
            state.x += gui.mouse.dragX;
            state.y += gui.mouse.dragY;
        }
    }

    if (gui.mouse.hoversElement() || gui.mouse.hoversChild()) {
        if (gui.mouse.isM1Down() || gui.mouse.isM2Down()) {
            gui.currentLayer.bringToFront();
        }
    }

    const bounds = gui.currentElement.bounds;
    bounds.x = state.x;
    bounds.y = state.y;
    bounds.w = w;
    bounds.h = h;

    gui.drawContext.setFillStyle('#DDDDDD');
    gui.drawContext.fillRect(state.x, state.y, w, h);

    gui.drawContext.setStrokeStyle('#000000');
    gui.drawContext.strokeRect(state.x, state.y, w, h);

    gui.drawContext.beginPath();
    gui.drawContext.rect(state.x + 1, state.y + 1, w - 2, h - 2);
    gui.drawContext.clip();
}

function endPanel() {
    gui.endLayer();
}

export const panel = {
    begin: beginPanel,
    end: endPanel,
};
