import { StyledDittoContext } from '../../src/StyledDittoImGui';

function alignStartFractionOfParent(
    g: StyledDittoContext,
    fraction: number,
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
        if (defaultFn && bounds[xOrY]) {
            return;
        }

        const totalSpacing = g.boxSize.parentTotalSpacing;
        const availSpace = parentBounds[wOrH] - (totalSpacing * 2);

        bounds[xOrY] = parentBounds[xOrY] + (availSpace * fraction) + totalSpacing;
    };
}

function alignEndFractionOfParent(
    g: StyledDittoContext,
    fraction: number,
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
        if (defaultFn && bounds[xOrY]) {
            return;
        }
        
        const totalSpacing = g.boxSize.parentTotalSpacing;
        const availSpace = parentBounds[wOrH] - (totalSpacing * 2);
        const end = parentBounds[xOrY] + (availSpace * fraction) + totalSpacing;

        bounds[xOrY] = end - bounds[wOrH];
    };
}

function alignStartOffsetFromParent(
    g: StyledDittoContext,
    offset: number,
    xOrY: 'x' | 'y',
    defaultFn: boolean = false,
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
        bounds[xOrY] = parentBounds[xOrY] + totalSpacing + offset;
    };
}

function alignEndOffsetFromParent(
    g: StyledDittoContext,
    offset: number,
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
        if (defaultFn && bounds[xOrY]) {
            return;
        }

        const totalSpacing = g.boxSize.parentTotalSpacing;
        const parentEnd = parentBounds[xOrY] + parentBounds[wOrH];

        bounds[xOrY] = parentEnd + offset - bounds[wOrH] - totalSpacing;
    };
}

// align by fraction of parent
export function alignTopFractionOfParent(g: StyledDittoContext, frac: number = 0) {
    return alignStartFractionOfParent(g, frac, 'y', 'h');
}

export function alignLeftFractionOfParent(g: StyledDittoContext, frac: number = 0) {
    return alignStartFractionOfParent(g, frac, 'x', 'w');
}

export function alignBottomFractionOfParent(g: StyledDittoContext, frac: number = 1) {
    return alignEndFractionOfParent(g, frac, 'y', 'h');
}

export function alignRightFractionOfParent(g: StyledDittoContext, frac: number = 1) {
    return alignEndFractionOfParent(g, frac, 'x', 'w');
}

// align offset
export function alignTopOffsetFromParent(g: StyledDittoContext, offset: number = 0) {
    return alignStartOffsetFromParent(g, offset, 'y');
}

export function alignLeftOffsetFromParent(g: StyledDittoContext, offset: number = 0) {
    return alignStartOffsetFromParent(g, offset, 'x');
}

export function alignBottomOffsetFromParent(g: StyledDittoContext, offset: number = 0) {
    return alignEndOffsetFromParent(g, offset, 'y', 'h');
}

export function alignRightOffsetFromParent(g: StyledDittoContext, offset: number = 0) {
    return alignEndOffsetFromParent(g, offset, 'x', 'w');
}
