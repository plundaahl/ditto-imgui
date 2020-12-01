import { StyledDittoContext } from '../../../src/StyledDittoImGui';
import { StateComponentKey } from '../../../src/DittoImGui';
import { drawColorSwatch } from './drawColorSwatch';
import Color from '../../../src/lib/Color';
import {
    DISPLAY_MODE_NONE,
    DISPLAY_MODE_HSL,
} from './DisplayMode';

const stateKey = new StateComponentKey('colorSwatch', { displayMode: DISPLAY_MODE_NONE });

export function colorSwatch(
    gui: StyledDittoContext,
    key: string,
    color: Color,
) {
    gui.beginElement(key);
    const state = gui.state.getStateComponent(stateKey);

    drawColorSwatch(gui, color, state.displayMode);

    // behavior
    if (gui.controller.isElementTriggered()) {
        state.displayMode = (state.displayMode + 1) % (DISPLAY_MODE_HSL + 1);
    }

    const toggled = gui.controller.isElementToggled();
    gui.endElement();

    return toggled;
}
