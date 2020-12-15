import { StateComponentKey } from '../../src/DittoImGui';
import { StyledDittoContext } from '../../src/StyledDittoImGui';
import { extBoxBevelled as boxBevelled } from './box';
import { beginTitleBar, endTitleBar } from './titleBar';
import { fillLayout, verticalLayout } from './layout';

const { createFillLayout } = fillLayout;
const {
    createVerticalLayout,
    AUTOFILL_WIDTH,
    WITH_BORDER,
    WITH_PADDING,
} = verticalLayout;

const stateKey = new StateComponentKey('example/panel', {
    x: 0,
    y: 0,
    collapsed: false,
});

function beginPanel(gui: StyledDittoContext, key: string, x: number, y: number, w: number, h: number, extraFlags: number = 0) {
    const borderWidth = gui.boxSize.getBorderWidth();
    const borderWidthX2 = borderWidth * 2;

    gui.beginLayer(key, extraFlags);
    gui.layout.setLayout(createFillLayout(gui));

    const state = gui.state.getStateComponent(stateKey, { x, y, collapsed: false });
    const isWindowInteracted = gui.controller.isElementInteracted();
    const bounds = gui.bounds.getElementBounds();

    bounds.x = state.x;
    bounds.y = state.y;
    bounds.w = w;
    bounds.h = h;

    boxBevelled.begin(gui, 'box', 0, true);
    gui.layout.setLayout(createVerticalLayout(gui, AUTOFILL_WIDTH));

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

    gui.beginElement('contents');
    gui.bounds.getElementBounds().h = h - gui.bounds.getSiblingBounds().h;
    gui.layout.setLayout(
        createVerticalLayout(
            gui,
            WITH_BORDER | WITH_PADDING | AUTOFILL_WIDTH
        )
    );
}

function endPanel(gui: StyledDittoContext) {
    gui.endElement();
    boxBevelled.end(gui, 'panel', 'idle');
    gui.endLayer();
}

export const panel = {
    begin: beginPanel,
    end: endPanel,
};
