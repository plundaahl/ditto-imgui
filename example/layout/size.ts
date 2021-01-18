import { StyledDittoContext } from '../../src/StyledDittoImGui';

export function sizeExactly(
    g: StyledDittoContext,
    amount: number,
    axis: 'w' | 'h',
    defaultFn: boolean = false,
) {
    return () => {
        const bounds = g.bounds.getElementBounds();
        if (defaultFn && bounds[axis]) {
            return;
        } bounds[axis] = amount;
    };
}

export function sizeLimitExactly(
    g: StyledDittoContext,
    amount: number,
    axis: 'w' | 'h',
    limitFn: (a: number, b: number) => number,
) {
    return () => {
        const bounds = g.bounds.getElementBounds();
        bounds[axis] = limitFn(amount, bounds[axis]);
    };
}

export function sizeFractionOfParent(
    g: StyledDittoContext,
    fraction: number,
    axis: 'w' | 'h',
    defaultFn: boolean = false,
) {
    return () => {
        const parentBounds = g.bounds.getParentBounds();
        if (!parentBounds) {
            return;
        }

        const bounds = g.bounds.getElementBounds();
        if (defaultFn && bounds[axis]) {
            return;
        }

        const spaceAtEdges = g.boxSize.parentTotalSpacing;
        const availSpace = parentBounds[axis] - (spaceAtEdges * 2);
        bounds[axis] = (availSpace * fraction);
    };
}

export function sizeLimitFractionOfParent(
    g: StyledDittoContext,
    fraction: number,
    axis: 'w' | 'h',
    limitFn: (a: number, b: number) => number,
) {
    return () => {
        const parentBounds = g.bounds.getParentBounds();
        if (!parentBounds) {
            return;
        }

        const bounds = g.bounds.getElementBounds();
        const spaceAtEdges = g.boxSize.parentTotalSpacing;
        const availSpace = parentBounds[axis] - (spaceAtEdges * 2);

        bounds[axis] = limitFn(
            (availSpace * fraction) - spaceAtEdges,
            bounds[axis],
        );
    };
}

// exact values
export function widthExactly(g: StyledDittoContext, width: number) {
    return sizeExactly(g, width, 'w');
}

export function heightExactly(g: StyledDittoContext, height: number) {
    return sizeExactly(g, height, 'h');
}

// default exact values
export function defaultWidthExactly(g: StyledDittoContext, width: number) {
    return sizeExactly(g, width, 'w', true);
}

export function defaultHeightExactly(g: StyledDittoContext, height: number) {
    return sizeExactly(g, height, 'h', true);
}

// exact value limits
export function widthAtMost(g: StyledDittoContext, amount: number) {
    return sizeLimitExactly(g, amount, 'w', Math.min);
}

export function heightAtMost(g: StyledDittoContext, amount: number) {
    return sizeLimitExactly(g, amount, 'h', Math.min);
}

export function widthAtLeast(g: StyledDittoContext, amount: number) {
    return sizeLimitExactly(g, amount, 'w', Math.max);
}

export function heightAtLeast(g: StyledDittoContext, amount: number) {
    return sizeLimitExactly(g, amount, 'h', Math.max);
}

// fractions of parent
export function widthFractionOfParent(g: StyledDittoContext, fraction: number) {
    return sizeFractionOfParent(g, fraction, 'w');
}

export function heightFractionOfParent(g: StyledDittoContext, fraction: number) {
    return sizeFractionOfParent(g, fraction, 'h');
}

// default fraction-of-parent values
export function defaultWidthFractionOfParent(g: StyledDittoContext, fraction: number) {
    return sizeFractionOfParent(g, fraction, 'w', true);
}

export function defaultHeightFractionOfParent(g: StyledDittoContext, fraction: number) {
    return sizeFractionOfParent(g, fraction, 'h', true);
}

// fraction-of-parent limits
export function widthAtMostFractionOfParent(g: StyledDittoContext, fraction: number) {
    return sizeLimitFractionOfParent(g, fraction, 'w', Math.min);
}

export function widthAtLeastFractionOfParent(g: StyledDittoContext, fraction: number) {
    return sizeLimitFractionOfParent(g, fraction, 'w', Math.max);
}

export function heightAtMostFractionOfParent(g: StyledDittoContext, fraction: number) {
    return sizeLimitFractionOfParent(g, fraction, 'h', Math.min);
}

export function heightAtLeastFractionOfParent(g: StyledDittoContext, fraction: number) {
    return sizeLimitFractionOfParent(g, fraction, 'h', Math.max);
}

// parent-fills
export function widthFillsParent(g: StyledDittoContext) {
    return sizeFractionOfParent(g, 1, 'w');
}

export function defaultWidthFillsParent(g: StyledDittoContext) {
    return sizeFractionOfParent(g, 1, 'w', true);
}

export function heightFillsParent(g: StyledDittoContext) {
    return sizeFractionOfParent(g, 1, 'h');
}

export function defaultHeightFillsParent(g: StyledDittoContext) {
    return sizeFractionOfParent(g, 1, 'h', true);
}

// utilities
export function allDimensionsAtLeastZero(g: StyledDittoContext) {
    return () => {
        const bounds = g.bounds.getElementBounds();
        bounds.w = Math.max(bounds.w, 0);
        bounds.h = Math.max(bounds.h, 0);
    };
}
