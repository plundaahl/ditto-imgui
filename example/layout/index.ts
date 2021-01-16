import { Box } from '../../src/DittoImGui/types';
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

export function defaultXExactly(g: StyledDittoContext, x: number) {
    return () => {
        const bounds = g.bounds.getElementBounds();
        bounds.x = bounds.x || x;
    };
}

export function defaultXFractionOfParent(g: StyledDittoContext, fraction: number) {
    return () => {
        const parentBounds = g.bounds.getParentBounds();
        if (!parentBounds) {
            return;
        }
        const bounds = g.bounds.getElementBounds();
        if (bounds.x === undefined) {
            return;
        }
        const padding = g.boxSize.parentPadding;
        const border = g.boxSize.parentBorder;
        const availSpace = (parentBounds.w - (border * 2) - padding);
        bounds.x = parentBounds.x + (availSpace * fraction) + padding + border;
    };
}

// Y
export function yExactly(g: StyledDittoContext, y: number) {
    return () => g.bounds.getElementBounds().y = y;
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

export function defaultYExactly(g: StyledDittoContext, y: number) {
    return () => {
        const bounds = g.bounds.getElementBounds();
        bounds.y = bounds.y || y;
    };
}

export function defaultYFractionOfParent(g: StyledDittoContext, fraction: number) {
    return () => {
        const parentBounds = g.bounds.getParentBounds();
        if (!parentBounds) {
            return;
        }
        const bounds = g.bounds.getElementBounds();
        if (bounds.y === undefined) {
            return;
        }
        const padding = g.boxSize.parentPadding;
        const border = g.boxSize.parentBorder;
        const availSpace = (parentBounds.w - (border * 2) - padding);
        bounds.y = parentBounds.y + (availSpace * fraction) + padding + border;
    };
}

// CHILDREN
export function belowLastSibling(g: StyledDittoContext) {
    return () => {
        const siblingBounds = g.bounds.getSiblingBounds();
        if (!siblingBounds) {
            return;
        }

        if (siblingBounds.h) {
            g.bounds.getElementBounds().y = siblingBounds.y + siblingBounds.h + g.boxSize.parentPadding;
        } else {
            const parentBounds = g.bounds.getParentBounds();
            if (!parentBounds) {
                return;
            }
            g.bounds.getElementBounds().y = parentBounds.y + g.boxSize.parentTotalSpacing;
        }
    };
}

export function aboveLastSibling(g: StyledDittoContext) {
    return () => {
        const siblingBounds = g.bounds.getSiblingBounds();
        if (!siblingBounds) {
            return;
        }

        const elementBounds = g.bounds.getElementBounds();
        if (siblingBounds.h) {
            elementBounds.y = siblingBounds.y - elementBounds.h - g.boxSize.parentPadding;
        } else {
            const parentBounds = g.bounds.getParentBounds();
            if (!parentBounds) {
                return;
            }
            elementBounds.y = parentBounds.y + parentBounds.h - elementBounds.h - g.boxSize.parentTotalSpacing;
        }
    };
}

export function heightFillsSpaceBelowLastSibling(g: StyledDittoContext) {
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

        bounds.y = siblingBounds.h
            ? bounds.y = siblingBounds.y + siblingBounds.h + g.boxSize.parentPadding
            : bounds.y = parentBounds.y + g.boxSize.parentTotalSpacing;

        bounds.h = (parentBounds.y + parentBounds.h) - bounds.y - g.boxSize.parentTotalSpacing;
    };
}

export function heightAtMostSpaceBelowLastSibling(g: StyledDittoContext) {
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

        bounds.y = siblingBounds.h
            ? bounds.y = siblingBounds.y + siblingBounds.h + g.boxSize.parentPadding
            : bounds.y = parentBounds.y + g.boxSize.parentTotalSpacing;

        bounds.h = Math.min(
            (parentBounds.y + parentBounds.h) - bounds.y - g.boxSize.parentTotalSpacing,
            bounds.h,
        );
    };
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

export const LEFT_TO_RIGHT = gridFlag();
export const RIGHT_TO_LEFT = gridFlag();
export const TOP_TO_BOTTOM = gridFlag();
export const BOTTOM_TO_TOP = gridFlag();
export const FIXED_WIDTH = gridFlag();
export const FIXED_HEIGHT = gridFlag();

export function asGridCell(
    g: StyledDittoContext,
    flags: number,
    width: number,
    height: number,
    cellNum?: number,
) {
    let cell: number = cellNum === undefined ? 0 : cellNum;
    let lastElemKey: string;

    const fixedWidth = flags & FIXED_WIDTH;
    const fixedHeight = flags & FIXED_HEIGHT;

    let direction: number = LEFT_TO_RIGHT;
    if (flags & RIGHT_TO_LEFT) {
        direction = RIGHT_TO_LEFT;
    } else if (flags & TOP_TO_BOTTOM) {
        direction = TOP_TO_BOTTOM;
    } else if (flags & BOTTOM_TO_TOP) {
        direction = BOTTOM_TO_TOP;
    }

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

        bounds.w = cellWidth - padding;
        bounds.h = cellHeight - padding;

        const baseX = parentBounds.x + edgeSpacing;
        const baseY = parentBounds.y + edgeSpacing;

        if (direction === LEFT_TO_RIGHT) {
            bounds.x = baseX + ((cell % numColumns) * cellWidth);
            bounds.y = baseY + (Math.floor(cell / numColumns) * cellHeight);
        } else if (direction === RIGHT_TO_LEFT) {
            bounds.x = baseX + totalWidth - (((cell % numColumns) + 1) * cellWidth);
            bounds.y = baseY + (Math.floor(cell / numColumns) * cellHeight);
        } else if (direction === TOP_TO_BOTTOM) {
            bounds.x = baseX + (Math.floor(cell / numRows) * cellWidth);
            bounds.y = baseY + ((cell % numRows) * cellHeight);
        } else if (direction === BOTTOM_TO_TOP) {
            bounds.x = baseX + (Math.floor(cell / numRows) * cellHeight);
            bounds.y = baseY + totalWidth - (((cell % numRows) + 1) * cellWidth);
        }

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
