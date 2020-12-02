import { StyledDittoContext } from '../../../src/StyledDittoImGui';
import { StateComponentKey, PERSISTENT } from '../../../src/DittoImGui';
import { panel } from '../panel';
import { slider } from '../slider';
import { button } from '../button';
import { colorSwatch } from './colorSwatch';
import Color from '../../../src/lib/Color';

const stateKey = new StateComponentKey('colorEditor', {
    h: 0,
    s: 0,
    l: 0,
});

const editColor = new Color();
const hue = (_ = editColor.h) => editColor.h = _;
const sat = (_ = editColor.s) => editColor.s = _;
const lum = (_ = editColor.l) => editColor.l = _;
const red = (_ = editColor.r) => editColor.r = _;
const grn = (_ = editColor.g) => editColor.g = _;
const blu = (_ = editColor.b) => editColor.b = _;

export function colorEditor(
    gui: StyledDittoContext,
    key: string,
    color: Color,
    x: number,
    y: number,
) {
    panel.begin(gui, key, x, y, 300, 400, PERSISTENT);

    const state = gui.state.getStateComponent(stateKey, {
        h: color.h,
        s: color.s,
        l: color.l,
    });

    editColor.fromHsl(state.h, state.s, state.l);

    colorSwatch(gui, 'color', editColor, false);
    slider(gui, 'Hue', hue, 0, 360, Math.round);
    slider(gui, 'Saturation', sat, 0, 1);
    slider(gui, 'Luma', lum, 0, 1);
    slider(gui, 'Red', red, 0, 255, Math.round);
    slider(gui, 'Green', grn, 0, 255, Math.round);
    slider(gui, 'Blue', blu, 0, 255, Math.round);
    const accepted = button(gui, 'Accept');
    const cancelled = button(gui, 'Cancel');
    const closed = accepted || cancelled;

    state.h = editColor.h;
    state.s = editColor.s;
    state.l = editColor.l;

    const border = gui.boxSize.getBorderWidth();
    const padding = gui.boxSize.getBorderWidth();
    const childBounds = gui.bounds.getChildBounds();
    gui.bounds.getElementBounds().h = childBounds.h + ((border + padding) * 2);

    if (accepted) {
        color.fromColor(editColor);
    }

    panel.end(gui);
    return closed;
}
