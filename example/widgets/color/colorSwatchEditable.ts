import { StyledDittoContext } from '../../../src/StyledDittoImGui';
import { StateComponentKey, PERSISTENT } from '../../../src/DittoImGui';
import { drawColorSwatch } from './drawColorSwatch';
import { colorEditor } from './colorEditor';
import Color from '../../../src/lib/Color';
import {
    DISPLAY_MODE_NONE,
    DISPLAY_MODE_HSL,
} from './DisplayMode';

const TWO_THIRDS = 2 / 3;

const stateKey = new StateComponentKey('colorSwatchEditable', {
    displayMode: DISPLAY_MODE_NONE,
    open: false,
});

export function colorSwatchEditable(
    gui: StyledDittoContext,
    key: string,
    color: Color,
    drawTitle: boolean = true,
) {
    gui.beginElement(key, PERSISTENT);
    const state = gui.state.getStateComponent(stateKey);
    const { x, y, w } = gui.bounds.getElementBounds();

    gui.beginElement('swatch');
    {
        const bounds = gui.bounds.getElementBounds();
        bounds.x = x;
        bounds.y = y;
        bounds.w = drawTitle ? w * TWO_THIRDS : w;

        drawColorSwatch(gui, color, state.displayMode, x, y, bounds.w);
        if (state.open) {
            const closed = colorEditor(gui, 'editor', color, x + w, y);
            if (closed) {
                state.open = false;
            }
        }

        // behavior
        if (gui.controller.isElementTriggered()) {
            state.displayMode = (state.displayMode + 1) % (DISPLAY_MODE_HSL + 1);
        }

        if (gui.controller.isElementToggled()) {
            state.open = true;
        }
    }
    const toggled = gui.controller.isElementToggled();
    gui.endElement();
    const height = gui.bounds.getChildBounds().h;
    gui.bounds.getElementBounds().h = height;

    if (drawTitle) {
        const padding = gui.boxSize.getPadding();
        gui.draw.setFont(gui.font.getFont('controlStd', 'idle'));
        gui.draw.setFillStyle(gui.theme.getColor('controlStd', 'idle', 'detail'));
        gui.draw.drawText(
            key,
            x + (w * TWO_THIRDS) + padding,
            y + ((height - gui.draw.measureText('m').ascent) * 0.5),
        );
    }

    gui.endElement();

    return toggled;
}
