import {
    StyledDittoContext,
    RegionType,
    Mode,
} from '../../../src/StyledDittoImGui';
import { verticalLayout } from '../layout';
import { drawBoxBevelled } from '../drawUtils';

const {
    createVerticalLayout,
    WITH_BORDER,
    WITH_PADDING,
    AUTOFILL_WIDTH,
} = verticalLayout;

function begin(
    gui: StyledDittoContext,
    key: string,
    flags: number = 0,
) {
    gui.beginElement(key, flags); // bevel
    gui.layout.setLayout(
        createVerticalLayout(gui, WITH_BORDER | WITH_PADDING | AUTOFILL_WIDTH),
    );
}

function end(
    gui: StyledDittoContext,
    region: RegionType,
    mode: Mode,
    inward: boolean = false,
) {
    const bounds = gui.bounds.getElementBounds();
    const border = gui.boxSize.getBorderWidth();
    const borderX2 = gui.boxSize.getBorderWidth();
    const totalPadding = (gui.boxSize.getPadding() * 2) + borderX2;

    if (!bounds.w) {
        bounds.w = gui.bounds.getChildBounds().w + totalPadding;
    }

    if (!bounds.h) {
        bounds.h = gui.bounds.getChildBounds().h + totalPadding;
    }

    drawBoxBevelled(
        gui,
        bounds.x,
        bounds.y,
        bounds.w,
        bounds.h,
        region,
        mode,
        inward,
    );

    gui.draw.beginPath();
    gui.draw.rect(
        bounds.x + border,
        bounds.y + border,
        bounds.w + borderX2,
        bounds.h + borderX2,
    );
    gui.draw.clip();

    gui.endElement();
}

export const extBoxBevelled = { begin, end };
