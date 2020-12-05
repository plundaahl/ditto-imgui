import { StyledDittoContext } from '../../../src/StyledDittoImGui';
import { StateComponentKey } from '../../../src/DittoImGui';
import { boxBevelled } from '../box';

const BUILD_HEIGHT = 99999;

const stateKey = new StateComponentKey('menu', {
    open: false,
    x: 0,
    y: 0,
});

function begin(
    gui: StyledDittoContext,
    key: string,
    x: number,
    y: number,
    w: number,
    open: (v?: boolean) => boolean,
) {
    gui.beginLayer(key);
    const state = gui.state.getStateComponent(stateKey);

    if (state.open
        && !gui.mouse.hoversChild()
        && !gui.mouse.hoversFloatingChild()
        && gui.mouse.isM1Down()
    ) {
        open(false);
    }

    const isOpen = open();
    if (isOpen && !state.open) {
        state.x = x;
        state.y = y;
    }

    state.open = isOpen;

    if (state.open) {
        gui.layer.bringLayerToFront();

        const border = gui.boxSize.getBorderWidth();
        const bounds = gui.bounds.getElementBounds();

        bounds.x = state.x + border;
        bounds.y = state.y + border;
        bounds.w = w - (border * 2);
        bounds.h = BUILD_HEIGHT;

        gui.layout.setLayout(createMenuLayout(gui));
    }

    return state.open;
}

function end(
    gui: StyledDittoContext,
) {
    const state = gui.state.getStateComponent(stateKey);

    if (state.open) {
        // draw background box
        const childBounds = gui.bounds.getChildBounds();
        const border = gui.boxSize.getBorderWidth();
        const bounds = gui.bounds.getElementBounds();

        bounds.x -= border;
        bounds.y -= border;
        bounds.h = childBounds.h + (border * 2);
        bounds.w = childBounds.w + (border * 2);
    
        const { x, y, w, h } = bounds;

        boxBevelled.begin(gui, x, y, w, h, 'controlStd', 'idle');
        boxBevelled.end(gui);
    }

    gui.endLayer();
}

function createMenuLayout(gui: StyledDittoContext) {
    return () => {
        const siblingBounds = gui.bounds.getSiblingBounds();
        const elementBounds = gui.bounds.getElementBounds();
        const parentBounds = gui.bounds.getParentBounds();

        if (!parentBounds) {
            return;
        }

        if (siblingBounds.h > 0) {
            elementBounds.y = siblingBounds.y + siblingBounds.h + 1;
        } else {
            elementBounds.y = parentBounds.y;
        }
        elementBounds.x = parentBounds.x;
        elementBounds.w = parentBounds.w;
    }
}

export const menu = { begin, end };
