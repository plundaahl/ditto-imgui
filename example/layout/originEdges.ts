import { StyledDittoContext } from '../../src/StyledDittoImGui';

function originExactly(
    g: StyledDittoContext,
    value: number,
    axis: 'x' | 'y',
    defaultFn: boolean = false,
) {
    return () => {
        const bounds = g.bounds.getElementBounds();
        if (defaultFn && bounds[axis]) {
            return;
        }
        bounds[axis] = value;
    };
}

function originLimitExactly(
    g: StyledDittoContext,
    value: number,
    axis: 'x' | 'y',
    limitFn: (a: number, b: number) => number,
) {
    return () => {
        const bounds = g.bounds.getElementBounds();
        bounds[axis] = limitFn(value, bounds[axis]);
    };
}

function originFractionOfParent(
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

function originLimitFractionOfParent(
    g: StyledDittoContext,
    fraction: number,
    xOrY: 'x' | 'y',
    wOrH: 'w' | 'h',
    limitFn: (a: number, b: number) => number,
) {
    return () => {
        const parentBounds = g.bounds.getParentBounds();
        if (!parentBounds) {
            return;
        }

        const bounds = g.bounds.getElementBounds();
        const totalSpacing = g.boxSize.parentTotalSpacing;
        const availSpace = parentBounds[wOrH] - (totalSpacing * 2);

        bounds[xOrY] = limitFn(
            bounds[xOrY],
            parentBounds[xOrY] + (availSpace * fraction) + totalSpacing,
        );
    };
}

// exact values
export function xExactly(g: StyledDittoContext, x: number) {
    return originExactly(g, x, 'x');
}

export function yExactly(g: StyledDittoContext, y: number) {
    return originExactly(g, y, 'y');
}

// exact value defaults
export function defaultXExactly(g: StyledDittoContext, x: number) {
    return originExactly(g, x, 'x', true);
}

export function defaultYExactly(g: StyledDittoContext, y: number) {
    return originExactly(g, y, 'y', true);
}

// exact value limits
export function xAtMostExactly(g: StyledDittoContext, x: number) {
    return originLimitExactly(g, x, 'x', Math.min);
}

export function xAtLeastExactly(g: StyledDittoContext, x: number) {
    return originLimitExactly(g, x, 'x', Math.max);
}

export function yAtMostExactly(g: StyledDittoContext, y: number) {
    return originLimitExactly(g, y, 'y', Math.min);
}

export function yAtLeastExactly(g: StyledDittoContext, y: number) {
    return originLimitExactly(g, y, 'y', Math.max);
}

// fractions of parent
export function xFractionOfParent(g: StyledDittoContext, fraction: number) {
    return originFractionOfParent(g, fraction, 'x', 'w');
}

export function yFractionOfParent(g: StyledDittoContext, fraction: number) {
    return originFractionOfParent(g, fraction, 'y', 'h');
}

// fraction-of-parent defaults
export function defaultXFractionOfParent(g: StyledDittoContext, fraction: number) {
    return originFractionOfParent(g, fraction, 'x', 'w', true);
}

export function defaultYFractionOfParent(g: StyledDittoContext, fraction: number) {
    return originFractionOfParent(g, fraction, 'y', 'h', true);
}

// fraction-of-parent limits
export function xAtMostFractionOfParent(g: StyledDittoContext, fraction: number) {
    return originLimitFractionOfParent(g, fraction, 'x', 'w', Math.min);
}

export function xAtLeastFractionOfParent(g: StyledDittoContext, fraction: number) {
    return originLimitFractionOfParent(g, fraction, 'x', 'w', Math.max);
}

export function yAtMostFractionOfParent(g: StyledDittoContext, fraction: number) {
    return originLimitFractionOfParent(g, fraction, 'y', 'h', Math.min);
}

export function yAtLeastFractionOfParent(g: StyledDittoContext, fraction: number) {
    return originLimitFractionOfParent(g, fraction, 'y', 'h', Math.max);
}
