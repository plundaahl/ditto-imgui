import { StyledDittoContext } from '../../../src/StyledDittoImGui';
import { StateComponentKey } from '../../../src/DittoImGui';
import { extMenuItem } from './extMenuItem';
import { menu } from './menu';

const stateKey = new StateComponentKey('subMenu', {
    open: false,
});

function begin(
    gui: StyledDittoContext,
    key: string,
    width: number,
) {
    const isInFocusChain = extMenuItem.begin(gui, key);
    const state = gui.state.getStateComponent(stateKey);
    const { x, y, w } = gui.bounds.getElementBounds();

    if (isInFocusChain && !state.open) {
        state.open = true;
    }

    menu.begin(
        gui,
        'submenu',
        x + (w * 0.5),
        y,
        width,
        (_ = state.open) => state.open = _,
    );

    return isInFocusChain;
}

function end(
    gui: StyledDittoContext,
) {
    menu.end(gui);
    extMenuItem.end(gui);
}

export const subMenu = { begin, end };
