import { StyledDittoContext } from '../../../src/StyledDittoImGui';
import { extColorSwatch } from './extColorSwatch';
import { control } from '../macro';
import Color from '../../../src/lib/Color';

export function colorSwatch(
    gui: StyledDittoContext,
    key: string,
    color: Color,
    drawTitle: boolean = true,
) {
    if (drawTitle) {
        control.begin(gui, key);
    }

    extColorSwatch.begin(gui, key, color);
    const toggled = gui.controller.isElementToggled();
    extColorSwatch.end(gui);

    if (drawTitle) {
        control.end(gui);
    }

    return toggled;
}
