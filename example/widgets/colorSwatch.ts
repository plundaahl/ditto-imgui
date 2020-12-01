import { StyledDittoContext } from '../../src/StyledDittoImGui';
import { StateComponentKey } from '../../src/DittoImGui';
import { bevelBox } from './bevelBox';
import Color from '../../src/lib/Color';

const WHITE = '#FFF';
const BLACK = '#000';
const REGION = 'editable';
const MODE = 'idle';

const DISPLAY_MODE_HEX = 0;
const DISPLAY_MODE_RGB = 1
const DISPLAY_MODE_HSL = 2;

const stateKey = new StateComponentKey('colorSwatch', {
    displayMode: DISPLAY_MODE_HEX,
});

export function colorSwatch(
    gui: StyledDittoContext,
    key: string,
    color: Color,
) {
    gui.beginElement(key);
    const state = gui.state.getStateComponent(stateKey);

    const bounds = gui.bounds.getElementBounds();
    const border = gui.boxSize.getBorderWidth();
    const padding = gui.boxSize.getPadding();
    const borderX2 = border * 2;
    const paddingX2 = padding * 2;

    gui.draw.setFont(gui.font.getFont(REGION, MODE));
    bounds.h = gui.draw.measureText('M').ascent + borderX2 + paddingX2;
    const { x, y, w, h } = bounds;

    // border
    bevelBox(gui, x, y, w, h, REGION, MODE);

    // color display
    gui.draw.setFillStyle(color.toHexString());
    gui.draw.fillRect(
        x + border,
        y + border,
        w - borderX2,
        h - borderX2,
    );

    // text output
    gui.draw.setFillStyle(color.l < 0.5 ? WHITE : BLACK);
    let colorStr: string = '';
    switch (state.displayMode) {
        case DISPLAY_MODE_HEX: colorStr = color.toHexString(); break;
        case DISPLAY_MODE_RGB: colorStr = color.toRgbString(); break;
        case DISPLAY_MODE_HSL: colorStr = color.toHslString(); break;
        default: colorStr = color.toHexString();
    }
    gui.draw.drawText(colorStr, x + border + padding, y + border + padding);

    // controls
    if (gui.controller.isElementTriggered()) {
        state.displayMode = (state.displayMode + 1) % (DISPLAY_MODE_HSL + 1);
    }

    gui.endElement();
}
