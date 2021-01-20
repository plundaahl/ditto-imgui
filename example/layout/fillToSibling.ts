import { StyledDittoContext } from '../../src/StyledDittoImGui';

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
export function fllBelowLastSiblingByDefault(g: StyledDittoContext) {
    return fillsAfterLastSibling(g, 'y', 'h', true);
}

export function fillRightOfLastSiblingByDefault(g: StyledDittoContext) {
    return fillsAfterLastSibling(g, 'x', 'w', true);
}

export function fillAboveLastSiblingByDefault(g: StyledDittoContext) {
    return fillBeforeLastSibling(g, 'y', 'h', true);
}

export function fillLeftOfLastSiblingByDefault(g: StyledDittoContext) {
    return fillBeforeLastSibling(g, 'x', 'w', true);
}
