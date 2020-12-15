import {
    StyledDittoContext,
    RegionType,
    Mode,
} from '../../../src/StyledDittoImGui';
import { drawBoxBevelled } from '../drawUtils';

function begin(
    gui: StyledDittoContext,
    x: number,
    y: number,
    w: number,
    h: number,
    region: RegionType,
    mode: Mode,
    inward: boolean = false,
) {
    const borderWidth = gui.boxSize.getBorderWidth();
    const borderWidthX2 = borderWidth * 2;

    drawBoxBevelled(gui, x, y, w, h, region, mode, inward);

    // clip inner contents
    gui.draw.save();
    gui.draw.beginPath();
    gui.draw.rect(
        x + borderWidth,
        y + borderWidth,
        w - borderWidthX2,
        h - borderWidthX2,
    );
    gui.draw.clip();
}

function end(
    gui: StyledDittoContext,
) {
    gui.draw.restore();
}

export const boxBevelled = { begin, end };
