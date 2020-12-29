import { StyledDittoContext } from '../../src/StyledDittoImGui';

// ABSOULTE ASSIGNMENTS
export function widthExactly(g: StyledDittoContext, width: number) {
    return () => g.bounds.getElementBounds().w = width;
}

export function heightExactly(g: StyledDittoContext, height: number) {
    return () => g.bounds.getElementBounds().h = height;
}

export function xExactly(g: StyledDittoContext, x: number) {
    return () => g.bounds.getElementBounds().x = x;
}

export function yExactly(g: StyledDittoContext, y: number) {
    return () => g.bounds.getElementBounds().y = y;
}

// RELATIVE TO PARENT
export function widthPercentOfParent(g: StyledDittoContext, percent: number) {
    return () => {
        const parentBounds = g.bounds.getParentBounds();
        if (!parentBounds) {
            return;
        }

        const padding = g.boxSize.parentPadding;
        const availSpace = (parentBounds.w - (g.boxSize.parentBorder * 2) - padding);
        const bounds = g.bounds.getElementBounds();
        bounds.w = (availSpace * percent) - padding;
    };
}

export function heightPercentOfParent(g: StyledDittoContext, percent: number) {
    return () => {
        const parentBounds = g.bounds.getParentBounds();
        if (!parentBounds) {
            return;
        }

        const padding = g.boxSize.parentPadding;
        const availSpace = (parentBounds.h - (g.boxSize.parentBorder * 2) - padding);
        const bounds = g.bounds.getElementBounds();
        bounds.h = (availSpace * percent) - padding;
    };
}

export function xPercentOfParent(g: StyledDittoContext, percent: number) {
    return () => {
        const parentBounds = g.bounds.getParentBounds();
        if (!parentBounds) {
            return;
        }

        const padding = g.boxSize.parentPadding;
        const border = g.boxSize.parentBorder;
        const availSpace = (parentBounds.w - (border * 2) - padding);
        const bounds = g.bounds.getElementBounds();
        bounds.x = parentBounds.x + (availSpace * percent) + padding + border;
    };
}

export function yPercentOfParent(g: StyledDittoContext, percent: number) {
    return () => {
        const parentBounds = g.bounds.getParentBounds();
        if (!parentBounds) {
            return;
        }

        const padding = g.boxSize.parentPadding;
        const border = g.boxSize.parentBorder;
        const availSpace = (parentBounds.h - (border * 2) - padding);
        const bounds = g.bounds.getElementBounds();
        bounds.y = parentBounds.y + (availSpace * percent) + padding + border;
    };
}

// DEFAULTS
export function defaultWidthExactly(g: StyledDittoContext, width: number) {
    return () => {
        const bounds = g.bounds.getElementBounds();
        bounds.w = bounds.w || width;
    };
}

export function defaultHeightExactly(g: StyledDittoContext, height: number) {
    return () => {
        const bounds = g.bounds.getElementBounds();
        bounds.h = bounds.h || height;
    };
}

export function defaultXExactly(g: StyledDittoContext, x: number) {
    return () => {
        const bounds = g.bounds.getElementBounds();
        bounds.x = bounds.x || x;
    };
}

export function defaultYExactly(g: StyledDittoContext, y: number) {
    return () => {
        const bounds = g.bounds.getElementBounds();
        bounds.y = bounds.y || y;
    };
}

// CHILDREN
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
