import { StyledDittoContext } from '../../src/StyledDittoImGui';
import { flagFactory } from '../../src/DittoImGui/lib/FlagFactory';

const flag = flagFactory();

const HORIZONTAL = 0;
const VERTICAL = flag();
const BY_VALUE = 0;
const BY_FRACTION = flag();
const BY_DEFAULT = flag();
const IGNORE_SPACING = flag();
const AT_LEAST = flag();
const AT_MOST = flag();

function setSize(
    g: StyledDittoContext,
    flags: number,
    amount: number,
) {
    return () => {
        const size = (flags & VERTICAL) ? 'h' : 'w';

        const bounds = g.bounds.getElementBounds();
        const parentBounds = g.bounds.getParentBounds();

        if (flags & BY_DEFAULT && bounds[size]) {
            return;
        }

        const parentSpacing = g.boxSize.parentTotalSpacing;
        const spaceAtEdges = (flags & IGNORE_SPACING) ? 0 : parentSpacing;
        const availSpace = parentBounds ? parentBounds[size] - spaceAtEdges : 0;

        const newSize = ((flags & BY_FRACTION) ? availSpace * amount : amount)
            - parentSpacing;

        if (flags & AT_MOST) {
            bounds[size] = Math.min(bounds[size], newSize);
        } else if (flags & AT_LEAST) {
            bounds[size] = Math.max(bounds[size], newSize);
        } else {
            bounds[size] = newSize;
        }
    };
}

// exact values
export function widthExactlyAmount(g: StyledDittoContext, width: number) {
    return setSize(g, HORIZONTAL | BY_VALUE, width);
}

export function heightExactlyAmount(g: StyledDittoContext, height: number) {
    return setSize(g, VERTICAL | BY_VALUE, height);
}

// default exact values
export function widthDefaultAmount(g: StyledDittoContext, width: number) {
    return setSize(g, HORIZONTAL | BY_VALUE | BY_DEFAULT, width);
}

export function heightDefaultAmount(g: StyledDittoContext, height: number) {
    return setSize(g, VERTICAL | BY_VALUE | BY_DEFAULT, height);
}

// exact value limits
export function widthAtMostAmount(g: StyledDittoContext, amount: number) {
    return setSize(g, HORIZONTAL | BY_VALUE | AT_MOST, amount);
}

export function heightAtMostAmount(g: StyledDittoContext, amount: number) {
    return setSize(g, VERTICAL | BY_VALUE | AT_MOST, amount);
}

export function widthAtLeastAmount(g: StyledDittoContext, amount: number) {
    return setSize(g, HORIZONTAL | BY_VALUE | AT_LEAST, amount);
}

export function heightAtLeastAmount(g: StyledDittoContext, amount: number) {
    return setSize(g, VERTICAL | BY_VALUE | AT_LEAST, amount);
}

// fractions of parent
export function widthExactlyFractionOfParent(g: StyledDittoContext, fraction: number) {
    return setSize(g, HORIZONTAL | BY_FRACTION, fraction);
}

export function heightExactlyFractionOfParent(g: StyledDittoContext, fraction: number) {
    return setSize(g, VERTICAL | BY_FRACTION, fraction);
}

// default fraction-of-parent values
export function widthDefaultFractionOfParent(g: StyledDittoContext, fraction: number) {
    return setSize(g, HORIZONTAL | BY_FRACTION | BY_DEFAULT, fraction);
}

export function heightDefaultFractionOfParent(g: StyledDittoContext, fraction: number) {
    return setSize(g, VERTICAL | BY_FRACTION | BY_DEFAULT, fraction);
}

// fraction-of-parent limits
export function widthAtMostFractionOfParent(g: StyledDittoContext, fraction: number) {
    return setSize(g, HORIZONTAL | BY_FRACTION | AT_MOST, fraction);
}

export function widthAtLeastFractionOfParent(g: StyledDittoContext, fraction: number) {
    return setSize(g, HORIZONTAL | BY_FRACTION | AT_LEAST, fraction);
}

export function heightAtMostFractionOfParent(g: StyledDittoContext, fraction: number) {
    return setSize(g, VERTICAL | BY_FRACTION | AT_MOST, fraction);
}

export function heightAtLeastFractionOfParent(g: StyledDittoContext, fraction: number) {
    return setSize(g, VERTICAL | BY_FRACTION | AT_LEAST, fraction);
}

// parent-fills
export function widthFillsParent(g: StyledDittoContext) {
    return widthExactlyFractionOfParent(g, 1);
}

export function defaultWidthFillsParent(g: StyledDittoContext) {
    return widthDefaultFractionOfParent(g, 1);
}

export function heightFillsParent(g: StyledDittoContext) {
    return heightExactlyFractionOfParent(g, 1);
}

export function defaultHeightFillsParent(g: StyledDittoContext) {
    return heightDefaultFractionOfParent(g, 1);
}

// utilities
export function allDimensionsAtLeastZero(g: StyledDittoContext) {
    return () => {
        const bounds = g.bounds.getElementBounds();
        bounds.w = Math.max(bounds.w, 0);
        bounds.h = Math.max(bounds.h, 0);
    };
}
