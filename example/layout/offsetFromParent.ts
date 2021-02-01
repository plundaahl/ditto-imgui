import { StyledDittoContext } from '../../src/StyledDittoImGui';
import { flagFactory } from '../../src/DittoImGui/lib/FlagFactory';

const flag = flagFactory();

const VERTICAL = flag();
const HORIZONTAL = 0;
const ALIGN_END = flag();
const ALIGN_START = 0;
const TO_PARENT_END = flag();
const TO_PARENT_START = 0;
const BY_VALUE = flag();
const BY_FRACTION = 0;
const BY_DEFAULT = flag();
const AT_LEAST = flag();
const AT_MOST = flag();

export const offsetFromParentFlags = {
    HORIZONTAL,
    VERTICAL,
    ALIGN_START,
    ALIGN_END,
    TO_PARENT_START,
    TO_PARENT_END,
    BY_FRACTION,
    BY_VALUE,
    BY_DEFAULT,
    AT_LEAST,
    AT_MOST,
};

export function offsetFromParent(
    g: StyledDittoContext,
    flags: number,
    offset: number = 0,
) {
    const start = flags & VERTICAL ? 'y' : 'x';
    const size = flags & VERTICAL ? 'h' : 'w';

    return () => {
        const parentBounds = g.bounds.getParentBounds();
        if (!parentBounds) {
            return;
        }

        const bounds = g.bounds.getElementBounds();
        if ((flags & BY_DEFAULT) && bounds[start]) {
            return;
        }

        const totalSpacing = g.boxSize.parentTotalSpacing;
        const availSpace = parentBounds[size] - totalSpacing;
        const offsetValue = flags & BY_VALUE ? offset : 0;
        const offsetFraction = !(flags & BY_VALUE) ? availSpace * offset : 0;

        const newStartPosition = parentBounds[start]
            + ((flags & ALIGN_END) ? 0 : totalSpacing)
            + ((flags & TO_PARENT_END) ? availSpace : 0)
            - ((flags & ALIGN_END) ? bounds[size] : 0)
            + offsetValue
            + offsetFraction;

        if (flags & AT_MOST) {
            bounds[start] = Math.min(bounds[start], newStartPosition);
        } else if (flags & AT_LEAST) {
            bounds[start] = Math.max(bounds[start], newStartPosition);
        } else {
            bounds[start] = newStartPosition;
        }
    }
}

// align by fraction of parent
export function alignTopFractionOfParent(g: StyledDittoContext, frac: number = 0) {
    return offsetFromParent(
        g,
        BY_FRACTION | VERTICAL | ALIGN_START | TO_PARENT_START,
        frac,
    );
}

export function alignLeftFractionOfParent(g: StyledDittoContext, frac: number = 0) {
    return offsetFromParent(
        g,
        BY_FRACTION | HORIZONTAL | ALIGN_START | TO_PARENT_START,
        frac,
    );
}

export function alignBottomFractionOfParent(g: StyledDittoContext, frac: number = 1) {
    return offsetFromParent(
        g,
        BY_FRACTION | VERTICAL | ALIGN_END | TO_PARENT_END,
        -frac,
    );
}

export function alignRightFractionOfParent(g: StyledDittoContext, frac: number = 1) {
    return offsetFromParent(
        g,
        BY_FRACTION | HORIZONTAL | ALIGN_END | TO_PARENT_END,
        -frac,
    );
}

// align offset
export function alignTopAmountFromParent(g: StyledDittoContext, offset: number = 0) {
    return offsetFromParent(
        g,
        BY_VALUE | VERTICAL | ALIGN_START | TO_PARENT_START,
        offset,
    );
}

export function alignLeftAmountFromParent(g: StyledDittoContext, offset: number = 0) {
    return offsetFromParent(
        g,
        BY_VALUE | HORIZONTAL | ALIGN_START | TO_PARENT_START,
        offset,
    );
}

export function alignBottomAmountFromParent(g: StyledDittoContext, offset: number = 0) {
    return offsetFromParent(
        g,
        BY_VALUE | VERTICAL | ALIGN_END | TO_PARENT_END,
        -offset,
    );
}

export function alignRightAmountFromParent(g: StyledDittoContext, offset: number = 0) {
    return offsetFromParent(
        g,
        BY_VALUE | HORIZONTAL | ALIGN_END | TO_PARENT_END,
        -offset,
    );
}
