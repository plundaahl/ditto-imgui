import { StyledDittoContext } from '../../src/StyledDittoImGui';

export function drawBorderBox(
    gui: StyledDittoContext,
    x: number,
    y: number,
    w: number,
    h: number,
    borderWidth: number,
) {
    if (!borderWidth) {
        return;
    }
    gui.draw.setLineWidth(borderWidth);

    const borderPosOffset = borderWidth * 0.5;
    const borderSizeOffset = borderPosOffset * 2;

    gui.draw.strokeRect(
        x + borderPosOffset,
        y + borderPosOffset,
        w - borderSizeOffset,
        h - borderSizeOffset,
    );
}
