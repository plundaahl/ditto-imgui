import { StyledDittoContext } from '../../src/StyledDittoImGui';
import { flagFactory } from '../../src/DittoImGui/lib/FlagFactory';

// WIDTH
export function widthExactly(g: StyledDittoContext, width: number) {
    return () => g.bounds.getElementBounds().w = width;
}

export function widthFractionOfParent(g: StyledDittoContext, fraction: number) {
    return () => {
        const parentBounds = g.bounds.getParentBounds();
        if (!parentBounds) {
            return;
        }
        const padding = g.boxSize.parentPadding;
        const availSpace = (parentBounds.w - (g.boxSize.parentBorder * 2) - padding);
        const bounds = g.bounds.getElementBounds();
        bounds.w = (availSpace * fraction) - padding;
    };
}

export function widthFillsParent(g: StyledDittoContext) {
    return () => {
        const parentBounds = g.bounds.getParentBounds();
        if (!parentBounds) {
            return;
        }
        const bounds = g.bounds.getElementBounds();
        const padding = g.boxSize.parentTotalSpacing;
        bounds.x = parentBounds.x + padding;
        bounds.w = parentBounds.w - (padding * 2);
    };
}

export function widthAtMost(g: StyledDittoContext, amount: number) {
    return () => {
        const bounds = g.bounds.getElementBounds();
        bounds.w = Math.min(bounds.w, amount);
    };
}

export function widthAtLeast(g: StyledDittoContext, amount: number) {
    return () => {
        const bounds = g.bounds.getElementBounds();
        bounds.w = Math.max(bounds.w, amount);
    };
}

export function widthAtMostFractionOfParent(g: StyledDittoContext, fraction: number) {
    return () => {
        const parentBounds = g.bounds.getParentBounds();
        if (!parentBounds) {
            return;
        }
        const padding = g.boxSize.parentPadding;
        const availSpace = (parentBounds.w - (g.boxSize.parentBorder * 2) - padding);
        const bounds = g.bounds.getElementBounds();
        bounds.w = Math.min(bounds.w, (availSpace * fraction) - padding);
    };
}

export function widthAtLeastFractionOfParent(g: StyledDittoContext, fraction: number) {
    return () => {
        const parentBounds = g.bounds.getParentBounds();
        if (!parentBounds) {
            return;
        }
        const padding = g.boxSize.parentPadding;
        const availSpace = (parentBounds.w - (g.boxSize.parentBorder * 2) - padding);
        const bounds = g.bounds.getElementBounds();
        bounds.w = Math.max(bounds.w, (availSpace * fraction) - padding);
    };
}

export function defaultWidthExactly(g: StyledDittoContext, width: number) {
    return () => {
        const bounds = g.bounds.getElementBounds();
        bounds.w = bounds.w || width;
    };
}

export function defaultWidthFractionOfParent(g: StyledDittoContext, fraction: number) {
    return () => {
        const parentBounds = g.bounds.getParentBounds();
        if (!parentBounds) {
            return;
        }
        const bounds = g.bounds.getElementBounds();
        if (bounds.w) {
            return;
        }
        const padding = g.boxSize.parentTotalSpacing;
        bounds.w = (parentBounds.w - (padding * 2)) * fraction;
    };
}

export function defaultWidthFillsParent(g: StyledDittoContext) {
    return defaultWidthFractionOfParent(g, 1);
}

// HEIGHT
export function heightExactly(g: StyledDittoContext, height: number) {
    return () => g.bounds.getElementBounds().h = height;
}

export function heightFractionOfParent(g: StyledDittoContext, fraction: number) {
    return () => {
        const parentBounds = g.bounds.getParentBounds();
        if (!parentBounds) {
            return;
        }

        const padding = g.boxSize.parentPadding;
        const availSpace = (parentBounds.h - (g.boxSize.parentBorder * 2) - padding);
        const bounds = g.bounds.getElementBounds();
        bounds.h = (availSpace * fraction) - padding;
    };
}

export function heightFillsParent(g: StyledDittoContext) {
    return () => {
        const parentBounds = g.bounds.getParentBounds();
        if (!parentBounds) {
            return;
        }
        const bounds = g.bounds.getElementBounds();
        const padding = g.boxSize.parentTotalSpacing;
        bounds.y = parentBounds.y + padding;
        bounds.h = parentBounds.h - (padding * 2);
    };
}

export function heightAtMost(g: StyledDittoContext, amount: number) {
    return () => {
        const bounds = g.bounds.getElementBounds();
        bounds.h = Math.min(bounds.h, amount);
    };
}

export function heightAtLeast(g: StyledDittoContext, amount: number) {
    return () => {
        const bounds = g.bounds.getElementBounds();
        bounds.h = Math.max(bounds.h, amount);
    };
}

export function heightAtMostFractionOfParent(g: StyledDittoContext, fraction: number) {
    return () => {
        const parentBounds = g.bounds.getParentBounds();
        if (!parentBounds) {
            return;
        }
        const padding = g.boxSize.parentPadding;
        const availSpace = (parentBounds.h - (g.boxSize.parentBorder * 2) - padding);
        const bounds = g.bounds.getElementBounds();
        bounds.h = Math.min(bounds.h, (availSpace * fraction) - padding);
    };
}

export function heightAtLeastFractionOfParent(g: StyledDittoContext, fraction: number) {
    return () => {
        const parentBounds = g.bounds.getParentBounds();
        if (!parentBounds) {
            return;
        }
        const padding = g.boxSize.parentPadding;
        const availSpace = (parentBounds.h - (g.boxSize.parentBorder * 2) - padding);
        const bounds = g.bounds.getElementBounds();
        bounds.h = Math.max(bounds.h, (availSpace * fraction) - padding);
    };
}

export function defaultHeightExactly(g: StyledDittoContext, height: number) {
    return () => {
        const bounds = g.bounds.getElementBounds();
        bounds.h = bounds.h || height;
    };
}

export function defaultHeightFractionOfParent(g: StyledDittoContext, fraction: number) {
    return () => {
        const parentBounds = g.bounds.getParentBounds();
        if (!parentBounds) {
            return;
        }
        const bounds = g.bounds.getElementBounds();
        if (bounds.h) {
            return;
        }
        const padding = g.boxSize.parentTotalSpacing;
        bounds.x = parentBounds.x + padding;
        bounds.h = (parentBounds.h - (padding * 2)) * fraction;
    };
}

export function defaultHeightFillsParent(g: StyledDittoContext) {
    return defaultHeightFractionOfParent(g, 1);
}


// X
export function xExactly(g: StyledDittoContext, x: number) {
    return () => g.bounds.getElementBounds().x = x;
}

export function defaultXExactly(g: StyledDittoContext, x: number) {
    return () => {
        const bounds = g.bounds.getElementBounds();
        bounds.x = bounds.x || x;
    };
}

export function xAtMostExactly(g: StyledDittoContext, x: number) {
    return () => {
        const bounds = g.bounds.getElementBounds();
        bounds.x = Math.min(bounds.x, x);
    };
}

export function xAtLeastExactly(g: StyledDittoContext, x: number) {
    return () => {
        const bounds = g.bounds.getElementBounds();
        bounds.x = Math.max(bounds.x, x);
    };
}

export function xFractionOfParent(g: StyledDittoContext, fraction: number) {
    return () => {
        const parentBounds = g.bounds.getParentBounds();
        if (!parentBounds) {
            return;
        }

        const padding = g.boxSize.parentPadding;
        const border = g.boxSize.parentBorder;
        const availSpace = (parentBounds.w - (border * 2) - padding);
        const bounds = g.bounds.getElementBounds();
        bounds.x = parentBounds.x + (availSpace * fraction) + padding + border;
    };
}

export function defaultXFractionOfParent(g: StyledDittoContext, fraction: number) {
    return () => {
        const parentBounds = g.bounds.getParentBounds();
        if (!parentBounds) {
            return;
        }
        const bounds = g.bounds.getElementBounds();
        if (bounds.x) {
            return;
        }
        const padding = g.boxSize.parentPadding;
        const border = g.boxSize.parentBorder;
        const availSpace = (parentBounds.w - (border * 2) - padding);
        bounds.x = parentBounds.x + (availSpace * fraction) + padding + border;
    };
}

export function xAtMostFractionOfParent(g: StyledDittoContext, fraction: number) {
    return () => {
        const parentBounds = g.bounds.getParentBounds();
        if (!parentBounds) {
            return;
        }
        const bounds = g.bounds.getElementBounds();
        const padding = g.boxSize.parentPadding;
        const border = g.boxSize.parentBorder;
        const availSpace = (parentBounds.w - (border * 2) - padding);
        bounds.x = Math.min(
            bounds.x,
            parentBounds.x + (availSpace * fraction) + padding + border,
        );
    };
}

export function xAtLeastFractionOfParent(g: StyledDittoContext, fraction: number) {
    return () => {
        const parentBounds = g.bounds.getParentBounds();
        if (!parentBounds) {
            return;
        }
        const bounds = g.bounds.getElementBounds();
        const padding = g.boxSize.parentPadding;
        const border = g.boxSize.parentBorder;
        const availSpace = (parentBounds.w - (border * 2) - padding);
        bounds.x = Math.max(
            bounds.x,
            parentBounds.x + (availSpace * fraction) + padding + border,
        );
    };
}

// Y
export function yExactly(g: StyledDittoContext, y: number) {
    return () => g.bounds.getElementBounds().y = y;
}

export function defaultYExactly(g: StyledDittoContext, y: number) {
    return () => {
        const bounds = g.bounds.getElementBounds();
        bounds.y = bounds.y || y;
    };
}

export function yAtLeastExactly(g: StyledDittoContext, y: number) {
    return () => {
        const bounds = g.bounds.getElementBounds();
        bounds.y = Math.max(bounds.y, y);
    };
}

export function yAtMostExactly(g: StyledDittoContext, y: number) {
    return () => {
        const bounds = g.bounds.getElementBounds();
        bounds.y = Math.min(bounds.y, y);
    };
}

export function yFractionOfParent(g: StyledDittoContext, fraction: number) {
    return () => {
        const parentBounds = g.bounds.getParentBounds();
        if (!parentBounds) {
            return;
        }

        const padding = g.boxSize.parentPadding;
        const border = g.boxSize.parentBorder;
        const availSpace = (parentBounds.h - (border * 2) - padding);
        const bounds = g.bounds.getElementBounds();
        bounds.y = parentBounds.y + (availSpace * fraction) + padding + border;
    };
}

export function defaultYFractionOfParent(g: StyledDittoContext, fraction: number) {
    return () => {
        const parentBounds = g.bounds.getParentBounds();
        if (!parentBounds) {
            return;
        }
        const bounds = g.bounds.getElementBounds();
        if (bounds.y) {
            return;
        }
        const padding = g.boxSize.parentPadding;
        const border = g.boxSize.parentBorder;
        const availSpace = (parentBounds.w - (border * 2) - padding);
        bounds.y = parentBounds.y + (availSpace * fraction) + padding + border;
    };
}

export function yAtMostFractionOfParent(g: StyledDittoContext, fraction: number) {
    return () => {
        const parentBounds = g.bounds.getParentBounds();
        if (!parentBounds) {
            return;
        }
        const bounds = g.bounds.getElementBounds();
        const padding = g.boxSize.parentPadding;
        const border = g.boxSize.parentBorder;
        const availSpace = (parentBounds.w - (border * 2) - padding);
        bounds.y = Math.min(
            bounds.y,
            parentBounds.y + (availSpace * fraction) + padding + border,
        );
    };
}

export function yAtLeastFractionOfParent(g: StyledDittoContext, fraction: number) {
    return () => {
        const parentBounds = g.bounds.getParentBounds();
        if (!parentBounds) {
            return;
        }
        const bounds = g.bounds.getElementBounds();
        const padding = g.boxSize.parentPadding;
        const border = g.boxSize.parentBorder;
        const availSpace = (parentBounds.w - (border * 2) - padding);
        bounds.y = Math.max(
            bounds.y,
            parentBounds.y + (availSpace * fraction) + padding + border,
        );
    };
}

// CHILDREN
function afterLastSibling(
    g: StyledDittoContext,
    xOrY: 'x' | 'y',
    wOrH: 'w' | 'h',
    defaultFn: boolean = false,
) {
    return () => {
        const siblingBounds = g.bounds.getSiblingBounds();
        if (!siblingBounds) {
            return;
        }

        const bounds = g.bounds.getElementBounds();
        if (defaultFn && bounds[xOrY]) {
            return;
        }

        if (siblingBounds[wOrH]) {
            bounds[xOrY] = siblingBounds[xOrY] + siblingBounds[wOrH] + g.boxSize.parentPadding;
        } else {
            const parentBounds = g.bounds.getParentBounds();
            if (!parentBounds) {
                return;
            }
            bounds[xOrY] = parentBounds[xOrY] + g.boxSize.parentTotalSpacing;
        }
    };
}

export function beforeLastSibling(
    g: StyledDittoContext,
    xOrY: 'x' | 'y',
    wOrH: 'w' | 'h',
    defaultFn: boolean = false,
) {
    return () => {
        const siblingBounds = g.bounds.getSiblingBounds();
        if (!siblingBounds) {
            return;
        }

        const bounds = g.bounds.getElementBounds();
        if (defaultFn && bounds[xOrY]) {
            return;
        }

        if (siblingBounds[wOrH]) {
            bounds[xOrY] = siblingBounds[xOrY] - bounds[wOrH] - g.boxSize.parentPadding;
        } else {
            const parentBounds = g.bounds.getParentBounds();
            if (!parentBounds) {
                return;
            }
            bounds[xOrY] = parentBounds[xOrY] + parentBounds[wOrH] - bounds[wOrH] - g.boxSize.parentTotalSpacing;
        }
    };
}

// relative arrangements
export function belowLastSibling(g: StyledDittoContext) {
    return afterLastSibling(g, 'y', 'h');
}

export function aboveLastSibling(g: StyledDittoContext) {
    return beforeLastSibling(g, 'y', 'h');
}

export function rightOfLastSibling(g: StyledDittoContext) {
    return afterLastSibling(g, 'x', 'w');
}

export function leftOfLastSibling(g: StyledDittoContext) {
    return beforeLastSibling(g, 'x', 'w');
}

// default relative arrangements
export function defaultBelowLastSibling(g: StyledDittoContext) {
    return afterLastSibling(g, 'y', 'h', true);
}

export function defaultAboveLastSibling(g: StyledDittoContext) {
    return beforeLastSibling(g, 'y', 'h', true);
}

export function defaultRightOfLastSibling(g: StyledDittoContext) {
    return afterLastSibling(g, 'x', 'w', true);
}

export function defaultLeftOfLastSibling(g: StyledDittoContext) {
    return beforeLastSibling(g, 'x', 'w', true);
}

// RELATIVE FILLS
export function fillsAfterLastSibling(
    g: StyledDittoContext,
    xOrY: 'x' | 'y',
    wOrH: 'w' | 'h',
    defaultFn: boolean = false,
) {
    return () => {
        const siblingBounds = g.bounds.getSiblingBounds();
        if (!siblingBounds) {
            return;
        }

        const parentBounds = g.bounds.getParentBounds();
        if (!parentBounds) {
            return;
        }

        const bounds = g.bounds.getElementBounds();
        if (defaultFn && bounds[wOrH]) {
            return;
        }

        bounds[xOrY] = siblingBounds[wOrH]
            ? bounds[xOrY] = siblingBounds[xOrY] + siblingBounds[wOrH] + g.boxSize.parentPadding
            : bounds[xOrY] = parentBounds[xOrY] + g.boxSize.parentTotalSpacing;

        bounds[wOrH] = (parentBounds[xOrY] + parentBounds[wOrH]) - bounds[xOrY] - g.boxSize.parentTotalSpacing;
    };
}

export function fillBeforeLastSibling(
    g: StyledDittoContext,
    xOrY: 'x' | 'y',
    wOrH: 'w' | 'h',
    defaultFn: boolean = false,
) {
    return () => {
        const siblingBounds = g.bounds.getSiblingBounds();
        if (!siblingBounds) {
            return;
        }

        const parentBounds = g.bounds.getParentBounds();
        if (!parentBounds) {
            return;
        }

        const bounds = g.bounds.getElementBounds();
        if (defaultFn && bounds[wOrH]) {
            return;
        }

        const totalSpacing = g.boxSize.parentTotalSpacing;
        const padding = g.boxSize.padding;

        bounds[xOrY] = parentBounds[xOrY] + totalSpacing;

        if (siblingBounds[wOrH]) {
            bounds[wOrH] = siblingBounds[xOrY] - bounds[xOrY] - padding;
        } else {
            bounds[wOrH] = bounds[xOrY] + parentBounds[wOrH] - (totalSpacing * 2);
        }
    };
}

export function fillBelowLastSibling(g: StyledDittoContext) {
    return fillsAfterLastSibling(g, 'y', 'h');
}

export function fillRightOfLastSibling(g: StyledDittoContext) {
    return fillsAfterLastSibling(g, 'x', 'w');
}

export function fillAboveLastSibling(g: StyledDittoContext) {
    return fillBeforeLastSibling(g, 'y', 'h');
}

export function fillLeftOfLastSibling(g: StyledDittoContext) {
    return fillBeforeLastSibling(g, 'x', 'w');
}

export function defaultFillBelowLastSibling(g: StyledDittoContext) {
    return fillsAfterLastSibling(g, 'y', 'h', true);
}

export function defaultFillRightOfLastSibling(g: StyledDittoContext) {
    return fillsAfterLastSibling(g, 'x', 'w', true);
}

export function defaultFillAboveLastSibling(g: StyledDittoContext) {
    return fillBeforeLastSibling(g, 'y', 'h', true);
}

export function defaultFillLeftOfLastSibling(g: StyledDittoContext) {
    return fillBeforeLastSibling(g, 'x', 'w', true);
}

// UTIL
export function allDimensionsAtLeastZero(g: StyledDittoContext) {
    return () => {
        const bounds = g.bounds.getElementBounds();
        bounds.w = Math.max(bounds.w, 0);
        bounds.h = Math.max(bounds.h, 0);
    };
}

// LAYOUTS
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

// CONTENT CONSTRAINTS
export function collapseBottomToContents(g: StyledDittoContext) {
    return () => {
        const childBounds = g.bounds.getChildBounds();
        const bounds = g.bounds.getElementBounds();
        const edgeSpacing = g.boxSize.totalSpacing;
        bounds.h = Math.min(bounds.h, (childBounds.y + childBounds.h) + edgeSpacing - bounds.y);
    };
}

export function collapseRightToContents(g: StyledDittoContext) {
    return () => {
        const childBounds = g.bounds.getChildBounds();
        const bounds = g.bounds.getElementBounds();
        const edgeSpacing = g.boxSize.totalSpacing;
        bounds.w = Math.min(bounds.w, (childBounds.x + childBounds.w) + edgeSpacing - bounds.x);
    };
}

export function collapseLeftToContents(g: StyledDittoContext) {
    return () => {
        const childBounds = g.bounds.getChildBounds();
        const bounds = g.bounds.getElementBounds();
        const edgeSpacing = g.boxSize.totalSpacing;

        const prevRight = bounds.x + bounds.w;

        bounds.x = childBounds.x - edgeSpacing;
        bounds.w = prevRight - bounds.x;
    };
}

export function collapseTopToContents(g: StyledDittoContext) {
    return () => {
        const childBounds = g.bounds.getChildBounds();
        const bounds = g.bounds.getElementBounds();
        const edgeSpacing = g.boxSize.totalSpacing;

        const prevBottom = bounds.y + bounds.h;

        bounds.y = childBounds.y - edgeSpacing;
        bounds.h = prevBottom - bounds.y;
    };
}

// TOP
function startAtLeastFractionOfParent(
    g: StyledDittoContext,
    fraction: number,
    xOrY: 'x' | 'y',
    wOrH: 'w' | 'h',
) {
    return () => {
        const parentBounds = g.bounds.getParentBounds();
        if (!parentBounds) {
            return;
        }
        const bounds = g.bounds.getElementBounds();
        const totalSpacing = g.boxSize.parentTotalSpacing;
        const availSpace = parentBounds[wOrH] - (totalSpacing * 2);
        const prevEnd = bounds[xOrY] + bounds[wOrH];

        bounds[xOrY] = Math.max(
            bounds[xOrY],
            parentBounds[xOrY] + (availSpace * fraction) + totalSpacing,
        );
        bounds[wOrH] = prevEnd - bounds[xOrY];
    };
}

function endAtMostFractionOfParent(
    g: StyledDittoContext,
    fraction: number,
    xOrY: 'x' | 'y',
    wOrH: 'w' | 'h',
) {
    return () => {
        const parentBounds = g.bounds.getParentBounds();
        if (!parentBounds) {
            return;
        }
        const bounds = g.bounds.getElementBounds();
        const totalSpacing = g.boxSize.parentTotalSpacing;
        const availSpace = parentBounds[wOrH] - (totalSpacing * 2);

        const end = Math.min(
            bounds[xOrY] + bounds[wOrH],
            parentBounds[xOrY] + (availSpace * fraction) + totalSpacing,
        );

        bounds[wOrH] = end - bounds[xOrY];
    };
}

export function topAtLeastFractionOfParent(g: StyledDittoContext, fraction: number) {
    return startAtLeastFractionOfParent(g, fraction, 'y', 'h');
}

export function bottomAtMostFractionOfParent(g: StyledDittoContext, fraction: number) {
    return endAtMostFractionOfParent(g, fraction, 'y', 'h');
}

export function leftAtLeastFractionOfParent(g: StyledDittoContext, fraction: number) {
    return startAtLeastFractionOfParent(g, fraction, 'x', 'w');
}

export function rightAtMostFractionOfParent(g: StyledDittoContext, fraction: number) {
    return endAtMostFractionOfParent(g, fraction, 'x', 'w');
}

export function edgesWithinParent(g: StyledDittoContext) {
    const leftConstraint = leftAtLeastFractionOfParent(g, 0);
    const topConstraint = topAtLeastFractionOfParent(g, 0);
    const rightConstraint = rightAtMostFractionOfParent(g, 1);
    const bottomConstraint = bottomAtMostFractionOfParent(g, 1);

    return () => {
        leftConstraint();
        topConstraint();
        rightConstraint();
        bottomConstraint();
    };
}
