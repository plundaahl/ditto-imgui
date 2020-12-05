import { StyledDittoContext } from '../../../src/StyledDittoImGui';
import { StateComponentKey } from '../../../src/DittoImGui';
import { colorEditor } from './colorEditor';
import { extColorSwatch } from './extColorSwatch';
import { control } from '../macro';
import Color from '../../../src/lib/Color';

const stateKey = new StateComponentKey('colorSwatchEditable', {
    open: false,
});

export function colorSwatchEditable(
    gui: StyledDittoContext,
    key: string,
    color: Color,
    drawTitle: boolean = true,
) {
    if (drawTitle) {
        control.begin(gui, key);
    }

    extColorSwatch.begin(gui, key, color);

    const state = gui.state.getStateComponent(stateKey);
    const { x, y, w } = gui.bounds.getElementBounds();

    if (state.open) {
        const closed = colorEditor(gui, 'editor', color, x + w, y);
        if (closed) {
            state.open = false;
        }
    }

    if (gui.controller.isElementToggled()) {
        state.open = true;
    }
    const toggled = gui.controller.isElementToggled();

    extColorSwatch.end(gui);

    if (drawTitle) {
        control.end(gui);
    }

    return toggled;
}
