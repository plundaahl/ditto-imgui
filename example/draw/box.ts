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
    gui.draw.setLineWidth(borderWidth);
    gui.draw.setStrokeStyle(gui.theme.getColor(region, mode, 'bgLowlight'));

    const borderPosOffset = borderWidth * 0.5;
    const borderSizeOffset = borderPosOffset * 2;

    gui.draw.strokeRect(
        x + borderPosOffset,
        y + borderPosOffset,
        w - borderSizeOffset,
        h - borderSizeOffset,
    );
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
