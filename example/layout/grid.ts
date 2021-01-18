import { StyledDittoContext } from '../../src/StyledDittoImGui';
import { flagFactory } from '../../src/DittoImGui/lib/FlagFactory';

const gridFlag = flagFactory();

export const TOP = gridFlag();
export const BOTTOM = gridFlag();
export const LEFT = gridFlag();
export const RIGHT = gridFlag();
export const GROW_HORIZONTAL = gridFlag();
export const GROW_VERTICAL = gridFlag();
export const FIXED_WIDTH = gridFlag();
export const FIXED_HEIGHT = gridFlag();

export function asGridCell(
    g: StyledDittoContext,
    width: number,
    height: number,
    flags: number = TOP | LEFT | GROW_HORIZONTAL,
    cellNum?: number,
) {
    const fixedWidth = Boolean(flags & FIXED_WIDTH);
    const fixedHeight = Boolean(flags & FIXED_HEIGHT);
    const growHorizontal = !(flags & GROW_VERTICAL);
    const vAlignTop = !(flags & BOTTOM);
    const hAlignLeft = !(flags & RIGHT);

    let cell: number = cellNum === undefined ? 0 : cellNum;
    let lastElemKey: string;

    return () => {
        if (!lastElemKey) {
            lastElemKey = g.key.getElementKey();
        }

        const parentBounds = g.bounds.getParentBounds();
        if (!parentBounds) {
            return;
        }

        const bounds = g.bounds.getElementBounds();
        const padding = g.boxSize.parentPadding;
        const edgeSpacing = g.boxSize.parentTotalSpacing;

        const totalWidth = parentBounds.w - edgeSpacing - g.boxSize.parentBorder;
        const totalHeight = parentBounds.h - edgeSpacing - g.boxSize.parentBorder;

        const cellWidth = fixedWidth ? width : totalWidth / width;
        const cellHeight = fixedHeight ? height : totalHeight / height;

        const numColumns = fixedWidth ? Math.floor(totalWidth / cellWidth) : width;
        const numRows = fixedHeight ? Math.floor(totalHeight / cellHeight) : height;

        const colOffset = growHorizontal ? cell % numColumns : Math.floor(cell / numRows);
        const rowOffset = growHorizontal ? Math.floor(cell / numColumns) : cell % numRows;

        const baseX = parentBounds.x + edgeSpacing;
        const baseY = parentBounds.y + edgeSpacing;

        bounds.w = cellWidth - padding;
        bounds.h = cellHeight - padding;
        
        bounds.x = hAlignLeft
            ? baseX + (colOffset * cellWidth)
            : baseX + totalWidth - ((colOffset + 1) * cellWidth);

        bounds.y = vAlignTop
            ? baseY + (rowOffset * cellHeight)
            : baseY + totalHeight - ((rowOffset + 1) * cellHeight);

        // This section allows us to automatically increment the current cell
        // as we advance through child elements
        if (cellNum === undefined) {
            const curElemKey = g.key.getElementKey();
            if (lastElemKey === undefined) {
                lastElemKey = curElemKey;
            } else if (curElemKey !== lastElemKey) {
                lastElemKey = curElemKey;
                cell++;
            }
        }
    };
}
