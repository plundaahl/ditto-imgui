import { StyledDittoContext } from '../../src/StyledDittoImGui';
import * as constraint from './atoms'

function composeConstraints(...constraintFns: { (g: StyledDittoContext): { (): void } }[]) {
    return (g: StyledDittoContext) => {
        return () => {
            for (const constraint of constraintFns) {
                constraint(g)();
            };
        }
    };
}

// Fill relative to parent
export const fillParentHorizontally = composeConstraints(
    constraint.offsetLeftFromParentLeft,
    constraint.offsetRightFromParentRight,
);

export const fillParentVertically = composeConstraints(
    constraint.offsetTopFromParentTop,
    constraint.offsetBottomFromParentBottom,
);

export const fillParentHorizontallyByDefault = composeConstraints(
    constraint.offsetLeftFromParentLeftByDefaultPx,
    constraint.offsetRightFromParentRightByDefaultPx,
);

export const fillParentVerticallyByDefault = composeConstraints(
    constraint.offsetTopFromParentTopByDefaultPx,
    constraint.offsetBottomFromParentBottomByDefaultPx,
);

// Fill remaining space relative to siblings
export const fillLeftOfLastSibling = composeConstraints(
    constraint.offsetLeftFromParentLeft,
    constraint.offsetRightFromSiblingLeft,
);

export const fillRightOfLastSibling = composeConstraints(
    constraint.offsetRightFromParentRight,
    constraint.offsetLeftFromSiblingRight,
);

export const fillAboveLastSibling = composeConstraints(
    constraint.offsetTopFromParentTop,
    constraint.offsetBottomFromSiblingTop,
);

export const fillBelowLastSibling = composeConstraints(
    constraint.offsetBottomFromParentBottom,
    constraint.offsetTopFromSiblingBottom,
);

export const fillLeftOfLastSiblingByDefault = composeConstraints(
    constraint.offsetLeftFromParentLeftByDefaultPx,
    constraint.offsetRightFromSiblingLeftByDefaultPx,
);

export const fillRightOfLastSiblingByDefault = composeConstraints(
    constraint.offsetRightFromParentRightByDefaultPx,
    constraint.offsetLeftFromSiblingRightByDefaultPx,
);

export const fillAboveLastSiblingByDefault = composeConstraints(
    constraint.offsetTopFromParentTopByDefaultPx,
    constraint.offsetBottomFromSiblingTopByDefaultPx,
);

export const fillBelowLastSiblingByDefault = composeConstraints(
    constraint.offsetBottomFromParentBottomByDefaultPx,
    constraint.offsetTopFromSiblingBottomByDefaultPx,
);

// Wrap children
export const collapseBottomToChildren = composeConstraints(
    constraint.offsetBottomFromChildBottom,
);

export const collapseTopToChildren = composeConstraints(
    constraint.offsetTopFromChildTop,
);

export const collapseLeftToChildren = composeConstraints(
    constraint.offsetLeftFromChildLeft,
);

export const collapseRightToChildren = composeConstraints(
    constraint.offsetRightFromChildRight,
);

export const collapseToChildrenHorizontally = composeConstraints(
    constraint.offsetLeftFromChildLeft,
    constraint.offsetRightFromChildRight,
);

export const collapseToChildrenVertically = composeConstraints(
    constraint.offsetTopFromChildTop,
    constraint.offsetBottomFromChildBottom,
);

export const collapseToChildren = composeConstraints(
    constraint.offsetTopFromChildTop,
    constraint.offsetBottomFromChildBottom,
    constraint.offsetLeftFromChildLeft,
    constraint.offsetRightFromChildRight,
);

// Constrain to parent
export const edgesWithinParent = composeConstraints(
    constraint.offsetBottomFromParentBottomByAtMostPx,
    constraint.offsetBottomFromParentTopByAtLeastPx,
    constraint.offsetLeftFromParentRightByAtMostPx,
    constraint.offsetLeftFromParentLeftByAtLeastPx,
    constraint.offsetRightFromParentRightByAtMostPx,
    constraint.offsetRightFromParentLeftByAtLeastPx,
    constraint.offsetTopFromParentTopByAtLeastPx,
    constraint.offsetTopFromParentBottomByAtMostPx,
)

// Row / Column
export const asRowRight = composeConstraints(
    constraint.offsetTopFromParentTop,
    constraint.offsetBottomFromParentBottom,
    constraint.offsetPosFromSiblingRight,
);

export const asRowLeft = composeConstraints(
    constraint.offsetTopFromParentTop,
    constraint.offsetBottomFromParentBottom,
    constraint.offsetPosFromSiblingLeft,
);

export const asColDown = composeConstraints(
    constraint.offsetLeftFromParentLeft,
    constraint.offsetRightFromParentRight,
    constraint.offsetPosFromSiblingBottom,
);

export const asColUp = composeConstraints(
    constraint.offsetLeftFromParentLeft,
    constraint.offsetRightFromParentRight,
    constraint.offsetPosFromSiblingTop,
);
