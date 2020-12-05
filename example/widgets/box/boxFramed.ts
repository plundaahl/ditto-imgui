import {
    StyledDittoContext,
    RegionType,
    Mode,
} from '../../../src/StyledDittoImGui';

function begin(
    gui: StyledDittoContext,
    x: number,
    y: number,
    w: number,
    h: number,
    region: RegionType,
    mode: Mode,
) {
    gui.draw.save();

    const highlight = gui.theme.getColor(region, mode, 'bgHighlight');
    const lowlight = gui.theme.getColor(region, mode, 'bgLowlight');

    gui.draw.setLineWidth(1);

    // highlights
    gui.draw.setStrokeStyle(highlight);
    gui.draw.beginPath();

    gui.draw.moveTo(x + 1, y + h - 1);
    gui.draw.lineTo(x + 1, y + 1);
    gui.draw.lineTo(x + w - 1, y + 1);

    gui.draw.moveTo(x, y + h);
    gui.draw.lineTo(x + w, y + h);
    gui.draw.lineTo(x + w, y);

    gui.draw.stroke();

    // lowlights
    gui.draw.setStrokeStyle(lowlight);
    gui.draw.beginPath();

    gui.draw.moveTo(x, y + h);
    gui.draw.lineTo(x, y);
    gui.draw.lineTo(x + w, y);

    gui.draw.moveTo(x + 2, y + h - 1);
    gui.draw.lineTo(x + w - 1, y + h - 1);
    gui.draw.lineTo(x + w - 1, y + 2);

    gui.draw.stroke();

    gui.draw.restore();

    // clip contents
    gui.draw.save();
    gui.draw.beginPath();
    gui.draw.rect(x + 1, y + 1, w - 2, h - 2);
    gui.draw.clip();
}

function end(
    gui: StyledDittoContext,
) {
    gui.draw.restore();
}

export const boxFramed = { begin, end };
