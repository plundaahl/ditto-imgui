import { StyledDittoContext } from '../../../src/StyledDittoImGui';
import { StateComponentKey } from '../../../src/DittoImGui';

const TEMP_H_BOUNDS = 99999;
const rowStateKey = new StateComponentKey('row', {
    cells: 0,
    cellsFilled: 0,
});

function beginRow(
    gui: StyledDittoContext,
    key: string,
    cells: number = 4,
) {
    gui.beginElement(key);

    const state = gui.state.getStateComponent(rowStateKey);
    state.cells = cells;
    state.cellsFilled = 0;

    gui.bounds.getElementBounds().h = TEMP_H_BOUNDS;
}

function endRow(gui: StyledDittoContext) {
    gui.bounds.getElementBounds().h = gui.bounds.getChildBounds().h;
    gui.endElement();
}

function beginCell(
    gui: StyledDittoContext,
    key: string,
    cellSpan: number = 1,
) {
    const rowState = gui.state.getStateComponent(rowStateKey);
    const parentBounds = gui.bounds.getElementBounds();
    const { cellsFilled, cells } = rowState;
    if (cellsFilled + cellSpan > cells) {
        throw new Error(`Attempting to fill a row of ${cells} cells with ${cellsFilled + cellSpan} worth of elements`);
    }

    const cellWidth = parentBounds.w / cells;
    const rightPadding = cellsFilled + cellSpan < cells
        ? gui.boxSize.getPadding()
        : 0;

    rowState.cellsFilled += cellSpan;

    gui.beginElement(key);

    const bounds = gui.bounds.getElementBounds();
    bounds.y = parentBounds.y;
    bounds.x = parentBounds.x + (cellWidth * cellsFilled);
    bounds.w = (cellWidth * cellSpan) - rightPadding;
    bounds.h = TEMP_H_BOUNDS;

    gui.layout.setLayout(createCellLayout(gui));
}


function endCell(gui: StyledDittoContext) {
    gui.bounds.getElementBounds().h = gui.bounds.getChildBounds().h;
    gui.endElement();
}

function createCellLayout(gui: StyledDittoContext) {
    return () => {
        const parentBounds = gui.bounds.getParentBounds();
        if (!parentBounds) {
            throw new Error();
        }

        const elementBounds = gui.bounds.getElementBounds();
        elementBounds.x = parentBounds.x;
        elementBounds.y = parentBounds.y;
        elementBounds.w = parentBounds.w;
        elementBounds.h = 30;
    };
}

export const row = {
    beginRow,
    endRow,
    beginCell,
    endCell,
};
