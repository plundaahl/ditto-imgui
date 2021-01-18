import { StyledDittoContext } from '../../src/StyledDittoImGui';

function startFractionOfParent(
    g: StyledDittoContext,
    fraction: number,
    xOrY: 'x' | 'y',
    wOrH: 'w' | 'h',
    defaultFn: boolean = true,
) {
    return () => {
        const parentBounds = g.bounds.getParentBounds();
        if (!parentBounds) {
            return;
        }

        const bounds = g.bounds.getElementBounds();
        if (defaultFn && bounds[xOrY]) {
            return;
        }

        const totalSpacing = g.boxSize.parentTotalSpacing;
        const availSpace = parentBounds[wOrH] - (totalSpacing * 2);
        const prevEnd = bounds[xOrY] + bounds[wOrH];

        bounds[xOrY] = parentBounds[xOrY] + (availSpace * fraction) + totalSpacing;
        bounds[wOrH] = prevEnd - bounds[xOrY];
    };
}

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

function endFractionOfParent(
    g: StyledDittoContext,
    fraction: number,
    xOrY: 'x' | 'y',
    wOrH: 'w' | 'h',
    defaultFn: boolean = true,
) {
    return () => {
        const parentBounds = g.bounds.getParentBounds();
        if (!parentBounds) {
            return;
        }

        const bounds = g.bounds.getElementBounds();
        if (defaultFn && bounds[wOrH]) {
            return;
        }
        
        const totalSpacing = g.boxSize.parentTotalSpacing;
        const availSpace = parentBounds[wOrH] - (totalSpacing * 2);
        const end = parentBounds[xOrY] + (availSpace * fraction) + totalSpacing;

        bounds[wOrH] = end - bounds[xOrY];
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

function fillParent(
    g: StyledDittoContext,
    xOrY: 'x' | 'y',
    wOrH: 'w' | 'h',
    defaultFn: boolean = false,
) {
    return () => {
        const parentBounds = g.bounds.getParentBounds();
        if (!parentBounds) {
            return;
        }

        const bounds = g.bounds.getElementBounds();
        if (defaultFn && bounds[xOrY] && bounds[wOrH]) {
            return;
        }

        const totalSpacing = g.boxSize.parentTotalSpacing;

        bounds[xOrY] = parentBounds[xOrY] + totalSpacing;
        bounds[wOrH] = parentBounds[wOrH] - (totalSpacing * 2);
    };
}

// exact positioning
export function topFractionOfParent(g: StyledDittoContext, fraction: number) {
    return startFractionOfParent(g, fraction, 'y', 'h');
}

export function leftFractionOfParent(g: StyledDittoContext, fraction: number) {
    return startFractionOfParent(g, fraction, 'x', 'w');
}

export function bottomFractionOfParent(g: StyledDittoContext, fraction: number) {
    return endFractionOfParent(g, fraction, 'y', 'h');
}

export function rightFractionOfParent(g: StyledDittoContext, fraction: number) {
    return endFractionOfParent(g, fraction, 'x', 'w');
}

// at least/most positioning
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

// fills parent
export function fillParentHorizontally(g: StyledDittoContext) {
    return fillParent(g, 'x', 'w');
}

export function fillParentVertically(g: StyledDittoContext) {
    return fillParent(g, 'y', 'h');
}

export function defaultFillsParentHorizontally(g: StyledDittoContext) {
    return fillParent(g, 'x', 'w', true);
}

export function defaultFillsParentVertically(g: StyledDittoContext) {
    return fillParent(g, 'y', 'w', true);
}

// constrain edges within parent
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
