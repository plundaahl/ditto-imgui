import { StyledDittoContext } from '../../../src/StyledDittoImGui';
import { extMenuItem } from './extMenuItem';

export function menuItem(
    gui: StyledDittoContext,
    key: string,
) {
    extMenuItem.begin(gui, key);
    const triggered = gui.controller.isElementTriggered();
    extMenuItem.end(gui);

    return triggered;
}

