import { StateComponentKey } from '../../src/DittoImGui';
import { StyledDittoContext } from '../../src/StyledDittoImGui';
import { boxBevelled } from './box';
import { beginTitleBar, endTitleBar } from './titleBar';

const stateKey = new StateComponentKey('example/panel', {
    x: 0,
    y: 0,
    collapsed: false,
});

function beginPanel(gui: StyledDittoContext, key: string, x: number, y: number, w: number, h: number, extraFlags: number = 0) {
    const borderWidth = gui.boxSize.getBorderWidth();
    const borderWidthX2 = borderWidth * 2;

    gui.beginLayer(key, extraFlags);

    const state = gui.state.getStateComponent(stateKey, { x, y, collapsed: false });
    const isWindowInteracted = gui.controller.isElementInteracted();
    const bounds = gui.bounds.getElementBounds();

    bounds.x = state.x;
    bounds.y = state.y;
    bounds.w = w;
    bounds.h = h;

    boxBevelled(gui, state.x, state.y, w, h, 'panel', 'idle');
    gui.draw.beginPath();
    gui.draw.rect(
        state.x + borderWidth,
        state.y + borderWidth,
        w - borderWidthX2,
        h - borderWidthX2,
    );
    gui.draw.clip();

    beginTitleBar(gui, key);
    const isTitlebarDragged = gui.controller.isElementDragged();
    const isTitlebarToggled = gui.controller.isElementToggled();
    const dragX = isTitlebarDragged ? gui.controller.getDragX() : 0;
    const dragY = isTitlebarDragged ? gui.controller.getDragY() : 0;
    endTitleBar(gui);

    if (isTitlebarDragged) {
        state.x += dragX;
        state.y += dragY;
    }

    if (isTitlebarToggled) {
        state.collapsed = !state.collapsed;
    }

    if (isWindowInteracted || gui.controller.isChildInteracted()) {
        gui.layer.bringLayerToFront();
    }

    if (state.collapsed) {
        const childBounds = gui.bounds.getChildBounds();
        bounds.h = childBounds.h + (childBounds.y - bounds.y) + borderWidthX2;
    }
}

function endPanel(gui: StyledDittoContext) {
    gui.endLayer();
}

export const panel = {
    begin: beginPanel,
    end: endPanel,
};
