import { StyledDittoContext } from '../../../src/StyledDittoImGui';
import { row } from '../layout';

function beginControl(
    gui: StyledDittoContext,
    key: string,
) {
    row.beginRow(gui, key, 3);
    const childIsFocused = gui.focus.isChildFocused();

    row.beginCell(gui, 'LABEL');
    gui.beginElement('label');

    const bounds = gui.bounds.getElementBounds();
    const { x, y } = bounds;
    const padding = gui.boxSize.getPadding();
    const labelColor = childIsFocused ? 'focused' : 'idle';

    gui.draw.setFont(gui.font.getFont('controlStd', 'idle'));
    gui.draw.setFillStyle(gui.theme.getColor('controlStd', labelColor, 'detail'));
    gui.draw.drawText(key, x, y + padding);

    bounds.h = gui.draw.measureText(key).height + padding;
    gui.endElement();
    row.endCell(gui);

    row.beginCell(gui, 'CONTROL', 2);
}

function endControl(
    gui: StyledDittoContext,
) {
    row.endCell(gui);
    row.endRow(gui);
}

export const control = {
    begin: beginControl,
    end: endControl,
};
