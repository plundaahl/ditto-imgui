import { StyledDittoContext } from '../../src/StyledDittoImGui';

// EXPLICIT ASSIGNMENTS
export function widthOf(g: StyledDittoContext, width: number) {
    return () => g.bounds.getElementBounds().w = width;
}

export function heightOf(g: StyledDittoContext, height: number) {
    return () => g.bounds.getElementBounds().h = height;
}

export function xOf(g: StyledDittoContext, x: number) {
    return () => g.bounds.getElementBounds().x = x;
}

export function yOf(g: StyledDittoContext, y: number) {
    return () => g.bounds.getElementBounds().y = y;
}

export function widthPercentOfParent(g: StyledDittoContext, percent: number, padding: number = 10) {
    const padX2 = padding * 2;

    return () => {
        const parentBounds = g.bounds.getParentBounds();
        if (!parentBounds) {
            return;
        }

        const bounds = g.bounds.getElementBounds();
        bounds.w = (parentBounds.w - padX2) * percent;
    };
}

export function xPercentOfParent(g: StyledDittoContext, percent: number, padding: number = 10) {
    const padX2 = padding * 2;

    return () => {
        const parentBounds = g.bounds.getParentBounds();
        if (!parentBounds) {
            return;
        }
        const bounds = g.bounds.getElementBounds();
        bounds.x = parentBounds.x + padding + ((parentBounds.w - padX2) * percent);
    };
}


// DEFAULTS
export function defaultWidthOf(g: StyledDittoContext, width: number) {
    return () => {
        const bounds = g.bounds.getElementBounds();
        bounds.w = bounds.w || width;
    };
}

export function defaultHeightOf(g: StyledDittoContext, height: number) {
    return () => {
        const bounds = g.bounds.getElementBounds();
        bounds.h = bounds.h || height;
    };
}

export function defaultXOf(g: StyledDittoContext, x: number) {
    return () => {
        const bounds = g.bounds.getElementBounds();
        bounds.x = bounds.x || x;
    };
}

export function defaultYOf(g: StyledDittoContext, y: number) {
    return () => {
        const bounds = g.bounds.getElementBounds();
        bounds.y = bounds.y || y;
    };
}


// CHILDREN
export function widthFillsParent(g: StyledDittoContext, padding: number = 10) {
    const padX2 = padding * 2;

    return () => {
        const parentBounds = g.bounds.getParentBounds();
        if (!parentBounds) {
            return;
        }
        const bounds = g.bounds.getElementBounds();

        bounds.x = parentBounds.x + padding;
        bounds.w = parentBounds.w - padX2;
    };
}

export function belowLastSibling(g: StyledDittoContext, padding: number = 10) {
    return () => {
        const siblingBounds = g.bounds.getSiblingBounds();
        if (!siblingBounds) {
            return;
        }

        if (siblingBounds.h) {
            g.bounds.getElementBounds().y = siblingBounds.y + siblingBounds.h + padding;
        } else {
            const parentBounds = g.bounds.getParentBounds();
            if (!parentBounds) {
                return;
            }
            g.bounds.getElementBounds().y = parentBounds.y + padding;
        }
    };
}
