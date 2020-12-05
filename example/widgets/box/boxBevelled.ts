import {
    StyledDittoContext,
    RegionType,
    Mode,
} from '../../../src/StyledDittoImGui';

function boxBevelledOld(
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

    gui.draw.save();

    // lower-right border
    gui.draw.setFillStyle(
        inward
            ? gui.theme.getColor(region, mode, 'bgHighlight')
            : gui.theme.getColor(region, mode, 'bgLowlight')
    );
    gui.draw.fillRect(x, y, w, h);

    // upper-left border
    gui.draw.setFillStyle(
       inward 
            ? gui.theme.getColor(region, mode, 'bgLowlight')
            : gui.theme.getColor(region, mode, 'bgHighlight')
    );
    gui.draw.beginPath();
    gui.draw.moveTo(x, y + h);
    gui.draw.lineTo(x + borderWidth, y + h - borderWidth);
    gui.draw.lineTo(x + w - borderWidth, y + borderWidth);
    gui.draw.lineTo(x + w, y);
    gui.draw.lineTo(x, y);
    gui.draw.fill();

    // background
    gui.draw.setFillStyle(gui.theme.getColor(region, mode, 'bg'));
    gui.draw.fillRect(
        x + borderWidth,
        y + borderWidth,
        w - borderWidthX2,
        h - borderWidthX2,
    );

    gui.draw.restore();
}

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

    gui.draw.save();

    // lower-right border
    gui.draw.setFillStyle(
        inward
            ? gui.theme.getColor(region, mode, 'bgHighlight')
            : gui.theme.getColor(region, mode, 'bgLowlight')
    );
    gui.draw.fillRect(x, y, w, h);

    // upper-left border
    gui.draw.setFillStyle(
       inward 
            ? gui.theme.getColor(region, mode, 'bgLowlight')
            : gui.theme.getColor(region, mode, 'bgHighlight')
    );
    gui.draw.beginPath();
    gui.draw.moveTo(x, y + h);
    gui.draw.lineTo(x + borderWidth, y + h - borderWidth);
    gui.draw.lineTo(x + w - borderWidth, y + borderWidth);
    gui.draw.lineTo(x + w, y);
    gui.draw.lineTo(x, y);
    gui.draw.fill();

    // background
    gui.draw.setFillStyle(gui.theme.getColor(region, mode, 'bg'));
    gui.draw.fillRect(
        x + borderWidth,
        y + borderWidth,
        w - borderWidthX2,
        h - borderWidthX2,
    );

    gui.draw.restore();

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
