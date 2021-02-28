import { StyledDittoContext } from '../../src/StyledDittoImGui';
import { RegionType, Mode, ThemeAspect } from '../../src/StyledDittoImGui';

export function borderBox(
    gui: StyledDittoContext,
    x: number,
    y: number,
    w: number,
    h: number,
    borderWidth: number,
    region: RegionType,
    mode: Mode,
) {
    if (borderWidth === 0) {
        return;
    }
    const halfBorderWidth = borderWidth * 0.5;
    const borderPosOffset = halfBorderWidth;
    const borderSizeOffset = borderPosOffset * 2;

    const bgColor = gui.theme.getColor(region, mode, borderWidth <= 1 ? 'bgLowlight' : 'bgHighlight');
    gui.draw.setLineWidth(borderWidth);
    gui.draw.setStrokeStyle(bgColor);
    gui.draw.strokeRect(
        x + borderPosOffset,
        y + borderPosOffset,
        w - borderSizeOffset,
        h - borderSizeOffset,
    );

    if (borderWidth <= 1) {
        return;
    }
    // Lowlight Top-Left
    gui.draw.setFillStyle(gui.theme.getColor(region, mode, 'bgLowlight'));
    gui.draw.beginPath();
    gui.draw.moveTo(x, y + h);
    gui.draw.lineTo(x + halfBorderWidth, y + h - halfBorderWidth);
    gui.draw.lineTo(x + halfBorderWidth, y + halfBorderWidth);
    gui.draw.lineTo(x + w - halfBorderWidth, y + halfBorderWidth);
    gui.draw.lineTo(x + w, y);
    gui.draw.lineTo(x, y);
    gui.draw.fill();

    // Lowlight Bottom-Right
    gui.draw.beginPath();
    gui.draw.moveTo(x + halfBorderWidth, y + h - halfBorderWidth);
    gui.draw.lineTo(x + borderWidth, y + h - borderWidth);
    gui.draw.lineTo(x + w - borderWidth, y + h - borderWidth);
    gui.draw.lineTo(x + w - borderWidth, y + borderWidth);
    gui.draw.lineTo(x + w - halfBorderWidth, y + halfBorderWidth);
    gui.draw.lineTo(x + w - halfBorderWidth, y + h - halfBorderWidth);
    gui.draw.fill();
}

export function bevelBox(
    g: StyledDittoContext,
    x: number,
    y: number,
    w: number,
    h: number,
    borderWidth: number,
    region: RegionType,
    mode: Mode,
    indented: boolean = false,
) {
    if (borderWidth > 0) {
        // top-left
        const topLeftColor: ThemeAspect = indented ? 'bgLowlight' : 'bgHighlight';
        g.draw.setFillStyle(g.theme.getColor(region, mode, topLeftColor));
        g.draw.fillRect(x, y, w, h);

        // bottom-right
        const bottomRightColor: ThemeAspect = indented ? 'bgHighlight' : 'bgLowlight';
        g.draw.setFillStyle(g.theme.getColor(region, mode, bottomRightColor));
        g.draw.beginPath();
        g.draw.moveTo(x, y + h);
        g.draw.lineTo(x + borderWidth, y + h - borderWidth);
        g.draw.lineTo(x + w - borderWidth, y + borderWidth);
        g.draw.lineTo(x + w, y);
        g.draw.lineTo(x + w, y + h);
        g.draw.lineTo(x, y + h);
        g.draw.fill();
    }

    // center
    const borderWidthX2 = borderWidth * 2;
    g.draw.setFillStyle(g.theme.getColor(region, mode, 'bg'));
    g.draw.fillRect(
        x + borderWidth,
        y + borderWidth,
        w - borderWidthX2,
        h - borderWidthX2,
    );
}
