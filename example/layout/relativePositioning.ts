import { StyledDittoContext } from '../../src/StyledDittoImGui';

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

// relative position
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

// relative position by default
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

// relative position, filling remaining space
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

// relative position, filling remaining space
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
