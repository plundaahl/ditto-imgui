import { StyledDittoContext } from '../../../src/StyledDittoImGui';
import { StateComponentKey, PERSISTENT } from '../../../src/DittoImGui';
import {
    boxBevelled,
    boxFramed,
} from '../box';

const stateKey = new StateComponentKey('containerCollapsable', {
    open: false,
    headerHeight: 0,
});

function begin(
    gui: StyledDittoContext,
    key: string,
    open: boolean = false,
) {
    gui.beginElement(key, PERSISTENT);
    const { x, y, w } = gui.bounds.getElementBounds();
    const state = gui.state.getStateComponent(stateKey, { open, headerHeight: 0 });

    if (header(gui, key, x, y, w, state.open)) {
        state.open = !state.open;
    }

    state.headerHeight = gui.bounds.getChildBounds().h;

    return state.open;
}

function end(gui: StyledDittoContext) {
    const state = gui.state.getStateComponent(stateKey);
    const childrenBounds = gui.bounds.getChildBounds();
    const border = gui.boxSize.getBorderWidth();
    const padding = gui.boxSize.getPadding();

    if (state.open) {
        gui.bounds.getElementBounds().h = childrenBounds.h + border + padding;

        const { x, y, w, h } = gui.bounds.getElementBounds();
        boxFramed.begin(
            gui,
            x,
            y,
            w,
            h,
            'controlStd',
            'idle',
        );
        boxFramed.end(gui);
    } else {
        gui.bounds.getElementBounds().h = state.headerHeight;
    }
    gui.endElement();
}

function header(
    gui: StyledDittoContext,
    headerText: string,
    parentX: number,
    parentY: number,
    parentW: number,
    open: boolean,
) {
    gui.beginElement('header');

    const border = gui.boxSize.getBorderWidth();
    const padding = gui.boxSize.getPadding();
    const borderX2 = border * 2;
    const paddingX2 = padding * 2;
    const paddingAndBorder = border + padding;

    const region = 'controlStd';
    const mode = 'idle';
    const bounds = gui.bounds.getElementBounds();

    gui.draw.setFont(gui.font.getFont(region, mode));
    const fontHeight = gui.draw.measureText('M').ascent;

    bounds.x = parentX;
    bounds.y = parentY;
    bounds.w = parentW;
    bounds.h = fontHeight + borderX2 + paddingX2;

    // header box
    const { x, y, w, h } = bounds;
    boxBevelled.begin(gui, x, y, w, h, region, mode);

    // arrow
    gui.draw.setFillStyle(gui.theme.getColor(region, mode, 'detail'));
    gui.draw.beginPath();
    gui.draw.moveTo(x + w - paddingAndBorder, y + paddingAndBorder);

    if (open) {
        gui.draw.lineTo(
            x + w - paddingAndBorder - fontHeight,
            y + paddingAndBorder,
        );
        gui.draw.lineTo(
            x + w - paddingAndBorder - (fontHeight * 0.5),
            y + paddingAndBorder + (fontHeight * 0.5),
        );
    } else {
        gui.draw.lineTo(
            x + w - paddingAndBorder,
            y + paddingAndBorder + fontHeight,
        );
        gui.draw.lineTo(
            x + w - paddingAndBorder - (fontHeight * 0.5),
            y + paddingAndBorder + (fontHeight * 0.5),
        );
    }

    gui.draw.lineTo(x + w - paddingAndBorder, y + paddingAndBorder);
    gui.draw.fill();

    // text
    gui.draw.save();
    gui.draw.beginPath();
    gui.draw.rect(x, y, w - paddingAndBorder - fontHeight - padding, h);
    gui.draw.clip();
    gui.draw.drawText(headerText, x + paddingAndBorder, y + paddingAndBorder);
    gui.draw.restore();

    const isTriggered = gui.controller.isElementTriggered();
    boxBevelled.end(gui);
    gui.endElement();

    return isTriggered;
}

export const containerCollapsable = { begin, end };
