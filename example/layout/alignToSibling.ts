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

// relative position
export function alignBelowLastSibling(g: StyledDittoContext) {
    return afterLastSibling(g, 'y', 'h');
}

export function alignAboveLastSibling(g: StyledDittoContext) {
    return beforeLastSibling(g, 'y', 'h');
}

export function alignRightOfLastSibling(g: StyledDittoContext) {
    return afterLastSibling(g, 'x', 'w');
}

export function alignLeftOfLastSibling(g: StyledDittoContext) {
    return beforeLastSibling(g, 'x', 'w');
}

// relative position by default
export function alignBelowLastSiblingByDefault(g: StyledDittoContext) {
    return afterLastSibling(g, 'y', 'h', true);
}

export function alignAboveLastSiblingByDefault(g: StyledDittoContext) {
    return beforeLastSibling(g, 'y', 'h', true);
}

export function alignRightOfLastSiblingByDefault(g: StyledDittoContext) {
    return afterLastSibling(g, 'x', 'w', true);
}

export function alignLeftOfLastSiblingByDefault(g: StyledDittoContext) {
    return beforeLastSibling(g, 'x', 'w', true);
}
