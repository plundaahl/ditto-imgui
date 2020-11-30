import {
    StyledDittoContext,
    regions,
    modes,
} from '../../src/StyledDittoImGui';

const BORDER_WIDTH = 2;
const BORDER_WIDTH_X2 = BORDER_WIDTH * 2;

export function bevelBox(
    gui: StyledDittoContext,
    x: number,
    y: number,
    w: number,
    h: number,
    region: keyof typeof regions,
    mode: keyof typeof modes,
    inward: boolean = false,
) {
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
    gui.draw.lineTo(x + BORDER_WIDTH, y + h - BORDER_WIDTH);
    gui.draw.lineTo(x + w - BORDER_WIDTH, y + BORDER_WIDTH);
    gui.draw.lineTo(x + w, y);
    gui.draw.lineTo(x, y);
    gui.draw.fill();

    // background
    gui.draw.setFillStyle(gui.theme.getColor(region, mode, 'bg'));
    gui.draw.fillRect(
        x + BORDER_WIDTH,
        y + BORDER_WIDTH,
        w - BORDER_WIDTH_X2,
        h - BORDER_WIDTH_X2,
    );

    gui.draw.restore();
}
