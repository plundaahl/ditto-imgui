import { StyledDittoContext } from '../../../src/StyledDittoImGui';
import { StateComponentKey, PERSISTENT } from '../../../src/DittoImGui';
import { boxBevelled } from '../box';
import Color from '../../../src/lib/Color';
import {
    DISPLAY_MODE_HEX,
    DISPLAY_MODE_RGB,
    DISPLAY_MODE_HSL,
    DISPLAY_MODE_NONE,
} from './DisplayMode';

const stateKey = new StateComponentKey('extColorSwatch', {
    displayMode: DISPLAY_MODE_NONE,
});

const WHITE = '#FFF';
const BLACK = '#000';
const REGION = 'editable';
const MODE = 'idle';

function begin(
    gui: StyledDittoContext,
    key: string,
    color: Color,
) {
    gui.beginElement(key, PERSISTENT);
    const state = gui.state.getStateComponent(stateKey);
    const bounds = gui.bounds.getElementBounds();
    const border = gui.boxSize.getBorderWidth();
    const padding = gui.boxSize.getPadding();

    const { displayMode } = state;
    const borderX2 = border * 2;
    const paddingX2 = padding * 2;

    gui.draw.setFont(gui.font.getFont(REGION, MODE));
    bounds.h = gui.draw.measureText('M').ascent + borderX2 + paddingX2;
    const { x, y, w, h } = bounds;

    // border
    boxBevelled.begin(gui, x, y, w, h, REGION, MODE);

    // color display
    gui.draw.setFillStyle(color.toHexString());
    gui.draw.fillRect(
        x,
        y,
        w,
        h,
    );

    // text output
    gui.draw.setFillStyle(color.l < 0.5 ? WHITE : BLACK);
    let colorStr: string = '';
    switch (displayMode) {
        case DISPLAY_MODE_HEX: colorStr = color.toHexString(); break;
        case DISPLAY_MODE_RGB: colorStr = color.toRgbString(); break;
        case DISPLAY_MODE_HSL: colorStr = color.toHslString(); break;
    }
    gui.draw.drawText(colorStr, x + border + padding, y + border + padding);

    // behavior
    if (gui.controller.isElementTriggered()) {
        state.displayMode = (state.displayMode + 1) % (DISPLAY_MODE_HSL + 1);
    }
}

function end(gui: StyledDittoContext) {
    boxBevelled.end(gui);
    gui.endElement();
}

export const extColorSwatch = {
    begin,
    end,
};
