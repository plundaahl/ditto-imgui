import { StyledDittoContext } from '../../src/StyledDittoImGui';

export function collapseBottomToContents(g: StyledDittoContext) {
    return () => {
        const childBounds = g.bounds.getChildBounds();
        const bounds = g.bounds.getElementBounds();
        const edgeSpacing = g.boxSize.totalSpacing;
        bounds.h = Math.min(bounds.h, (childBounds.y + childBounds.h) + edgeSpacing - bounds.y);
    };
}

export function collapseRightToContents(g: StyledDittoContext) {
    return () => {
        const childBounds = g.bounds.getChildBounds();
        const bounds = g.bounds.getElementBounds();
        const edgeSpacing = g.boxSize.totalSpacing;
        bounds.w = Math.min(bounds.w, (childBounds.x + childBounds.w) + edgeSpacing - bounds.x);
    };
}

export function collapseLeftToContents(g: StyledDittoContext) {
    return () => {
        const childBounds = g.bounds.getChildBounds();
        const bounds = g.bounds.getElementBounds();
        const edgeSpacing = g.boxSize.totalSpacing;

        const prevRight = bounds.x + bounds.w;

        bounds.x = childBounds.x - edgeSpacing;
        bounds.w = prevRight - bounds.x;
    };
}

export function collapseTopToContents(g: StyledDittoContext) {
    return () => {
        const childBounds = g.bounds.getChildBounds();
        const bounds = g.bounds.getElementBounds();
        const edgeSpacing = g.boxSize.totalSpacing;

        const prevBottom = bounds.y + bounds.h;

        bounds.y = childBounds.y - edgeSpacing;
        bounds.h = prevBottom - bounds.y;
    };
}
