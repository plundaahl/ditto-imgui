/**
 * This module contains atomic layout functions, which affect a single property
 * (such as width, the top edge, or the overall position) of the current
 * element, relative to its parent or siblings.
 */
import { StyledDittoContext } from '../../src/StyledDittoImGui';
import { flagFactory } from '../../src/DittoImGui/lib/FlagFactory';

const flag = flagFactory();

const VERT = flag();
const HORZ = flag();
const ALIGN_END = flag();
const ALIGN_START = flag();
const TO_END = flag();
const TO_START = flag();
const BY_PX = flag();
const BY_FR = flag();
const BY_DEFAULT = flag();
const AT_LEAST = flag();
const AT_MOST = flag();
const VS_PARENT = flag();
const VS_SIBLING = flag();
const VS_CHILDREN = flag();
const IGNORE_SPACING = flag();

// Shifts the position of the current element. Applicable flags:
//
//  HORZ | VERT             Controls the dimension
//  BY_DEFAULT              Exits early if element's start position != 0
//  AT_LEAST | AT_MOST      Optional. Derived position treated as a limit
//  VS_PARENT | VS_SIBLING  Selects context that we position relative to
//  TO_START | TO_END       Position relative to start vs. end of context
//  BY_PX | BY_FR           Unit by which offset is calculated
function offsetPos(
    g: StyledDittoContext,
    flags: number,
    offset: number = 0,
) {
    const start = flags & VERT ? 'y' : 'x';
    return () => {
        const bounds = g.bounds.getElementBounds();
        if ((flags & BY_DEFAULT) && bounds[start]) {
            return;
        }

        const newStartPosition = calculateOrigin(g, flags)
            + calculateOffset(g, flags, offset)
            + calculateCenter(g, flags);

        if (flags & AT_LEAST) {
            bounds[start] = Math.max(bounds[start], newStartPosition);
        } else if (flags & AT_MOST) {
            bounds[start] = Math.min(bounds[start], newStartPosition);
        } else {
            bounds[start] = newStartPosition;
        }
    }
}

// Adjusts the current element's size
//
//  HORZ | VERT             Controls the dimension (width or height)
//  BY_DEFAULT              Exits early if element's width/height != 0
//  AT_LEAST | AT_MOST      Optional. Derived size is treated as a limit
//  VS_PARENT | VS_SIBLING  Selects context used to adjust size relative to
//  BY_PX | BY_FR           Unit by which offset is calculated
//  IGNORE_SPACING          Optional. Ignores padding.
function setSize(
    g: StyledDittoContext,
    flags: number,
    amount: number,
) {
    const size = (flags & VERT) ? 'h' : 'w';
    return () => {
        const bounds = g.bounds.getElementBounds();
        const parentBounds = g.bounds.getParentBounds();

        if (flags & BY_DEFAULT && bounds[size]) {
            return;
        }

        let spaceAtStart = 0;
        let spaceAtEnd = 0;

        if (!(flags & IGNORE_SPACING)) {
            spaceAtStart = g.boxSize.parentTotalSpacing + g.boxSize.parentBorder;
            spaceAtEnd = g.boxSize.parentPadding;
        }

        const availSpace = parentBounds ? parentBounds[size] - spaceAtStart: 0;

        const newSize = ((flags & BY_FR) ? (availSpace * amount) - spaceAtEnd : amount);

        if (flags & AT_MOST) {
            bounds[size] = Math.min(bounds[size], newSize);
        } else if (flags & AT_LEAST) {
            bounds[size] = Math.max(bounds[size], newSize);
        } else {
            bounds[size] = newSize;
        }
    };
}

const identity = (newValue: number) => newValue;

// Adjusts a specific edge of the element, while leaving the opposing edge
// unmodified (this essentially stretches the element). Available flags:
//
//  HORZ | VERT             Controls the dimension
//  BY_DEFAULT              Exits early if given edge != 0
//  AT_LEAST | AT_MOST      Optional. Derived edge position treated as a limit
//  VS_PARENT | VS_SIBLING  Selects context that we position relative to
//  ALIGN_START | ALIGN_END Which edge in given dimension is being adjusted
//  TO_START | TO_END       Position relative to start vs. end of context
//  BY_PX | BY_FR           Unit by which offset is calculated
function offsetEdge(
    g: StyledDittoContext,
    flags: number,
    offset: number = 0,
) {
    const start = flags & VERT ? 'y' : 'x';
    const size = flags & VERT ? 'h' : 'w';
    const pinsEnd = flags & ALIGN_END;
    const applyExtraPaddingOffset = (
        ((flags & TO_END) && (flags & VS_PARENT))
        || ((flags & TO_START) && (flags & VS_SIBLING))
    );

    let applyLimit: { (newVal: number, curVal?: number): number } = identity;
    if (flags & AT_LEAST) {
        applyLimit = Math.max;
    } else if (flags & AT_MOST) {
        applyLimit = Math.min;
    }

    return () => {
        const bounds = g.bounds.getElementBounds();
        if (flags & BY_DEFAULT) {
            if ((flags & ALIGN_END) && bounds[size] > 0) {
                return;
            } else if ((flags & ALIGN_START) && bounds[start] !== 0) {
                return;
            }
        }

        const endEdge = bounds[start] + bounds[size];

        const oppositeEdgePos = pinsEnd ? bounds[start] : endEdge;
        const pinnedEdgePrevPos = pinsEnd
            ? endEdge
            : bounds[start];

        const projectedPinnedEdgeNewPos = calculateOrigin(g, flags)
            + calculateOffset(g, flags, offset)
            - ((applyExtraPaddingOffset) ? g.boxSize.parentPadding : 0);

        const pinnedEdgeNewPos = applyLimit(
            projectedPinnedEdgeNewPos,
            pinnedEdgePrevPos,
        );

        if (pinsEnd) {
            bounds[size] = pinnedEdgeNewPos - oppositeEdgePos;
            bounds[start] = oppositeEdgePos;
        } else {
            bounds[start] = pinnedEdgeNewPos;
            bounds[size] = oppositeEdgePos - pinnedEdgeNewPos;
        }
    }
}

function calculateOffset(g: StyledDittoContext, flags: number, amount: number): number {
    if (flags & BY_PX) {
        return amount;
    } else if (flags & BY_FR) {
        return calculateFrOffset(g, flags, amount);
    } else {
        throw new Error('Invalid unit flag');
    }
}

function calculateFrOffset(g: StyledDittoContext, flags: number, amount: number): number {
    const size = flags & VERT ? 'h' : 'w';
    let availSpace: number;

    if (flags & VS_PARENT) {
        const parentBounds = g.bounds.getParentBounds();
        if (!parentBounds) {
            return 0;
        }

        availSpace = parentBounds[size]
            - g.boxSize.parentTotalSpacing
            - g.boxSize.parentBorder;

    } else if (flags & VS_CHILDREN) {
        availSpace = g.bounds.getChildBounds()[size]
            + g.boxSize.totalSpacing
            - g.boxSize.border;
    } else {
        throw new Error('Invalid origin flag');
    }

    return availSpace * amount;
}

function calculateOrigin(g: StyledDittoContext, flags: number): number {
    if (flags & VS_PARENT) {
        return calculateParentOrigin(g, flags);
    } else if (flags & VS_SIBLING) {
        return calculateSiblingOrigin(g, flags);
    } else if (flags & VS_CHILDREN) {
        return calculateChildrenOrigin(g, flags);
    } else {
        throw new Error('Invalid origin flag');
    }
}

function calculateParentOrigin(g: StyledDittoContext, flags: number): number {
    const size = flags & VERT ? 'h' : 'w';
    const start = flags & VERT ? 'y' : 'x';

    const parentBounds = g.bounds.getParentBounds();
    if (!parentBounds) { return 0; }
    return (flags & TO_END)
        ? parentBounds[start] + parentBounds[size] - g.boxSize.parentBorder
        : parentBounds[start] + g.boxSize.parentTotalSpacing;
}

function calculateSiblingOrigin(g: StyledDittoContext, flags: number): number {
    const size = flags & VERT ? 'h' : 'w';
    const start = flags & VERT ? 'y' : 'x';

    const siblingBounds = g.bounds.getSiblingBounds();
    if (siblingBounds[size]) {
        return (flags & TO_END)
            ? siblingBounds[start] + siblingBounds[size] + g.boxSize.parentPadding
            : siblingBounds[start];
    }

    const parentBounds = g.bounds.getParentBounds();
    if (!parentBounds) { return 0; }
    return (flags & TO_END)
        ? parentBounds[start] + g.boxSize.parentTotalSpacing
        : parentBounds[start] + parentBounds[size] - g.boxSize.parentBorder;
}

function calculateChildrenOrigin(g: StyledDittoContext, flags: number): number {
    const size = flags & VERT ? 'h' : 'w';
    const start = flags & VERT ? 'y' : 'x';
    const childBounds = g.bounds.getChildBounds();
    return (flags & TO_END)
        ? childBounds[start] + childBounds[size] + g.boxSize.totalSpacing
        : childBounds[start] - g.boxSize.totalSpacing;
}

function calculateCenter(g: StyledDittoContext, flags: number): number {
    if (flags & ALIGN_END) {
        const size = flags & VERT ? 'h' : 'w';
        return -(g.bounds.getElementBounds()[size] + g.boxSize.parentPadding);
    }
    return 0;
}

// Factory Functions
function valuedPosOffsetFn(flags: number) {
    return (g: StyledDittoContext, offset: number = 0) => offsetPos(g, flags, offset);
}

function zeroedPosOffsetFn(flags: number) {
    return (g: StyledDittoContext) => offsetPos(g, flags);
}

function sizeFn(flags: number) {
    return (g: StyledDittoContext, amount: number) => setSize(g, flags, amount);
}

function valuedEdgeOffsetFn(flags: number) {
    return (g: StyledDittoContext, offset: number = 0) => offsetEdge(g, flags, offset);
}

function zeroedEdgeOffsetFn(flags: number) {
    return (g: StyledDittoContext) => offsetEdge(g, flags);
}

// Position By Parent
export const offsetPosFromParentBottom                  = zeroedPosOffsetFn(VS_PARENT | VERT | ALIGN_END | TO_END | BY_PX);
export const offsetPosFromParentBottomByAtLeastFr       = valuedPosOffsetFn(VS_PARENT | VERT | ALIGN_END | TO_END | AT_LEAST | BY_FR);
export const offsetPosFromParentBottomByAtLeastPx       = valuedPosOffsetFn(VS_PARENT | VERT | ALIGN_END | TO_END | AT_LEAST | BY_PX);
export const offsetPosFromParentBottomByAtMostFr        = valuedPosOffsetFn(VS_PARENT | VERT | ALIGN_END | TO_END | AT_MOST | BY_FR);
export const offsetPosFromParentBottomByAtMostPx        = valuedPosOffsetFn(VS_PARENT | VERT | ALIGN_END | TO_END | AT_MOST | BY_PX);
export const offsetPosFromParentBottomByDefault         = zeroedPosOffsetFn(VS_PARENT | VERT | ALIGN_END | TO_END | BY_DEFAULT);
export const offsetPosFromParentBottomByDefaultFr       = valuedPosOffsetFn(VS_PARENT | VERT | ALIGN_END | TO_END | BY_DEFAULT | BY_FR);
export const offsetPosFromParentBottomByDefaultPx       = valuedPosOffsetFn(VS_PARENT | VERT | ALIGN_END | TO_END | BY_DEFAULT | BY_PX);
export const offsetPosFromParentBottomByFr              = valuedPosOffsetFn(VS_PARENT | VERT | ALIGN_END | TO_END | BY_FR);
export const offsetPosFromParentBottomByPx              = valuedPosOffsetFn(VS_PARENT | VERT | ALIGN_END | TO_END | BY_PX);
export const offsetPosFromParentLeft                    = zeroedPosOffsetFn(VS_PARENT | HORZ | ALIGN_START | TO_START | BY_PX);
export const offsetPosFromParentLeftByAtLeastFr         = valuedPosOffsetFn(VS_PARENT | HORZ | ALIGN_START | TO_START | AT_LEAST | BY_FR);
export const offsetPosFromParentLeftByAtLeastPx         = valuedPosOffsetFn(VS_PARENT | HORZ | ALIGN_START | TO_START | AT_LEAST | BY_PX);
export const offsetPosFromParentLeftByAtMostFr          = valuedPosOffsetFn(VS_PARENT | HORZ | ALIGN_START | TO_START | AT_MOST | BY_FR);
export const offsetPosFromParentLeftByAtMostPx          = valuedPosOffsetFn(VS_PARENT | HORZ | ALIGN_START | TO_START | AT_MOST | BY_PX);
export const offsetPosFromParentLeftByDefault           = zeroedPosOffsetFn(VS_PARENT | HORZ | ALIGN_START | TO_START | BY_DEFAULT);
export const offsetPosFromParentLeftByDefaultFr         = valuedPosOffsetFn(VS_PARENT | HORZ | ALIGN_START | TO_START | BY_DEFAULT | BY_FR);
export const offsetPosFromParentLeftByDefaultPx         = valuedPosOffsetFn(VS_PARENT | HORZ | ALIGN_START | TO_START | BY_DEFAULT | BY_PX);
export const offsetPosFromParentLeftByFr                = valuedPosOffsetFn(VS_PARENT | HORZ | ALIGN_START | TO_START | BY_FR);
export const offsetPosFromParentLeftByPx                = valuedPosOffsetFn(VS_PARENT | HORZ | ALIGN_START | TO_START | BY_PX);
export const offsetPosFromParentRight                   = zeroedPosOffsetFn(VS_PARENT | HORZ | ALIGN_END | TO_END | BY_PX);
export const offsetPosFromParentRightByAtLeastFr        = valuedPosOffsetFn(VS_PARENT | HORZ | ALIGN_END | TO_END | AT_LEAST | BY_FR);
export const offsetPosFromParentRightByAtLeastPx        = valuedPosOffsetFn(VS_PARENT | HORZ | ALIGN_END | TO_END | AT_LEAST | BY_PX);
export const offsetPosFromParentRightByAtMostFr         = valuedPosOffsetFn(VS_PARENT | HORZ | ALIGN_END | TO_END | AT_MOST | BY_FR);
export const offsetPosFromParentRightByAtMostPx         = valuedPosOffsetFn(VS_PARENT | HORZ | ALIGN_END | TO_END | AT_MOST | BY_PX);
export const offsetPosFromParentRightByDefault          = zeroedPosOffsetFn(VS_PARENT | HORZ | ALIGN_END | TO_END | BY_DEFAULT);
export const offsetPosFromParentRightByDefaultFr        = valuedPosOffsetFn(VS_PARENT | HORZ | ALIGN_END | TO_END | BY_DEFAULT | BY_FR);
export const offsetPosFromParentRightByDefaultPx        = valuedPosOffsetFn(VS_PARENT | HORZ | ALIGN_END | TO_END | BY_DEFAULT | BY_PX);
export const offsetPosFromParentRightByFr               = valuedPosOffsetFn(VS_PARENT | HORZ | ALIGN_END | TO_END | BY_FR);
export const offsetPosFromParentRightByPx               = valuedPosOffsetFn(VS_PARENT | HORZ | ALIGN_END | TO_END | BY_PX);
export const offsetPosFromParentTop                     = zeroedPosOffsetFn(VS_PARENT | VERT | ALIGN_START | TO_START | BY_PX);
export const offsetPosFromParentTopByAtLeastFr          = valuedPosOffsetFn(VS_PARENT | VERT | ALIGN_START | TO_START | AT_LEAST | BY_FR);
export const offsetPosFromParentTopByAtLeastPx          = valuedPosOffsetFn(VS_PARENT | VERT | ALIGN_START | TO_START | AT_LEAST | BY_PX);
export const offsetPosFromParentTopByAtMostFr           = valuedPosOffsetFn(VS_PARENT | VERT | ALIGN_START | TO_START | AT_MOST | BY_FR);
export const offsetPosFromParentTopByAtMostPx           = valuedPosOffsetFn(VS_PARENT | VERT | ALIGN_START | TO_START | AT_MOST | BY_PX);
export const offsetPosFromParentTopByDefault            = zeroedPosOffsetFn(VS_PARENT | VERT | ALIGN_START | TO_START | BY_DEFAULT);
export const offsetPosFromParentTopByDefaultFr          = valuedPosOffsetFn(VS_PARENT | VERT | ALIGN_START | TO_START | BY_DEFAULT | BY_FR);
export const offsetPosFromParentTopByDefaultPx          = valuedPosOffsetFn(VS_PARENT | VERT | ALIGN_START | TO_START | BY_DEFAULT | BY_PX);
export const offsetPosFromParentTopByFr                 = valuedPosOffsetFn(VS_PARENT | VERT | ALIGN_START | TO_START | BY_FR);
export const offsetPosFromParentTopByPx                 = valuedPosOffsetFn(VS_PARENT | VERT | ALIGN_START | TO_START | BY_PX);

// Position By Sibling
export const offsetPosFromSiblingBottom                 = zeroedPosOffsetFn(VS_SIBLING | VERT | ALIGN_START | TO_END | BY_PX);
export const offsetPosFromSiblingBottomByAtLeastFr      = valuedPosOffsetFn(VS_SIBLING | VERT | ALIGN_START | TO_END | AT_LEAST | BY_FR);
export const offsetPosFromSiblingBottomByAtLeastPx      = valuedPosOffsetFn(VS_SIBLING | VERT | ALIGN_START | TO_END | AT_LEAST | BY_PX);
export const offsetPosFromSiblingBottomByAtMostFr       = valuedPosOffsetFn(VS_SIBLING | VERT | ALIGN_START | TO_END | AT_MOST | BY_FR);
export const offsetPosFromSiblingBottomByAtMostPx       = valuedPosOffsetFn(VS_SIBLING | VERT | ALIGN_START | TO_END | AT_MOST | BY_PX);
export const offsetPosFromSiblingBottomByDefault        = zeroedPosOffsetFn(VS_SIBLING | VERT | ALIGN_START | TO_END | BY_DEFAULT);
export const offsetPosFromSiblingBottomByDefaultFr      = valuedPosOffsetFn(VS_SIBLING | VERT | ALIGN_START | TO_END | BY_DEFAULT | BY_FR);
export const offsetPosFromSiblingBottomByDefaultPx      = valuedPosOffsetFn(VS_SIBLING | VERT | ALIGN_START | TO_END | BY_DEFAULT | BY_PX);
export const offsetPosFromSiblingBottomByFr             = valuedPosOffsetFn(VS_SIBLING | VERT | ALIGN_START | TO_END | BY_FR);
export const offsetPosFromSiblingBottomByPx             = valuedPosOffsetFn(VS_SIBLING | VERT | ALIGN_START | TO_END | BY_PX);
export const offsetPosFromSiblingLeft                   = zeroedPosOffsetFn(VS_SIBLING | HORZ | ALIGN_END | TO_START | BY_PX);
export const offsetPosFromSiblingLeftByAtLeastFr        = valuedPosOffsetFn(VS_SIBLING | HORZ | ALIGN_END | TO_START | AT_LEAST | BY_FR);
export const offsetPosFromSiblingLeftByAtLeastPx        = valuedPosOffsetFn(VS_SIBLING | HORZ | ALIGN_END | TO_START | AT_LEAST | BY_PX);
export const offsetPosFromSiblingLeftByAtMostFr         = valuedPosOffsetFn(VS_SIBLING | HORZ | ALIGN_END | TO_START | AT_MOST | BY_FR);
export const offsetPosFromSiblingLeftByAtMostPx         = valuedPosOffsetFn(VS_SIBLING | HORZ | ALIGN_END | TO_START | AT_MOST | BY_PX);
export const offsetPosFromSiblingLeftByDefault          = zeroedPosOffsetFn(VS_SIBLING | HORZ | ALIGN_END | TO_START | BY_DEFAULT);
export const offsetPosFromSiblingLeftByDefaultFr        = valuedPosOffsetFn(VS_SIBLING | HORZ | ALIGN_END | TO_START | BY_DEFAULT | BY_FR);
export const offsetPosFromSiblingLeftByDefaultPx        = valuedPosOffsetFn(VS_SIBLING | HORZ | ALIGN_END | TO_START | BY_DEFAULT | BY_PX);
export const offsetPosFromSiblingLeftByFr               = valuedPosOffsetFn(VS_SIBLING | HORZ | ALIGN_END | TO_START | BY_FR);
export const offsetPosFromSiblingLeftByPx               = valuedPosOffsetFn(VS_SIBLING | HORZ | ALIGN_END | TO_START | BY_PX);
export const offsetPosFromSiblingRight                  = zeroedPosOffsetFn(VS_SIBLING | HORZ | ALIGN_START | TO_END | BY_PX);
export const offsetPosFromSiblingRightByAtLeastFr       = valuedPosOffsetFn(VS_SIBLING | HORZ | ALIGN_START | TO_END | AT_LEAST | BY_FR);
export const offsetPosFromSiblingRightByAtLeastPx       = valuedPosOffsetFn(VS_SIBLING | HORZ | ALIGN_START | TO_END | AT_LEAST | BY_PX);
export const offsetPosFromSiblingRightByAtMostFr        = valuedPosOffsetFn(VS_SIBLING | HORZ | ALIGN_START | TO_END | AT_MOST | BY_FR);
export const offsetPosFromSiblingRightByAtMostPx        = valuedPosOffsetFn(VS_SIBLING | HORZ | ALIGN_START | TO_END | AT_MOST | BY_PX);
export const offsetPosFromSiblingRightByDefault         = zeroedPosOffsetFn(VS_SIBLING | HORZ | ALIGN_START | TO_END | BY_DEFAULT);
export const offsetPosFromSiblingRightByDefaultFr       = valuedPosOffsetFn(VS_SIBLING | HORZ | ALIGN_START | TO_END | BY_DEFAULT | BY_FR);
export const offsetPosFromSiblingRightByDefaultPx       = valuedPosOffsetFn(VS_SIBLING | HORZ | ALIGN_START | TO_END | BY_DEFAULT | BY_PX);
export const offsetPosFromSiblingRightByFr              = valuedPosOffsetFn(VS_SIBLING | HORZ | ALIGN_START | TO_END | BY_FR);
export const offsetPosFromSiblingRightByPx              = valuedPosOffsetFn(VS_SIBLING | HORZ | ALIGN_START | TO_END | BY_PX);
export const offsetPosFromSiblingTop                    = zeroedPosOffsetFn(VS_SIBLING | VERT | ALIGN_END | TO_START | BY_PX);
export const offsetPosFromSiblingTopByAtLeastFr         = valuedPosOffsetFn(VS_SIBLING | VERT | ALIGN_END | TO_START | AT_LEAST | BY_FR);
export const offsetPosFromSiblingTopByAtLeastPx         = valuedPosOffsetFn(VS_SIBLING | VERT | ALIGN_END | TO_START | AT_LEAST | BY_PX);
export const offsetPosFromSiblingTopByAtMostFr          = valuedPosOffsetFn(VS_SIBLING | VERT | ALIGN_END | TO_START | AT_MOST | BY_FR);
export const offsetPosFromSiblingTopByAtMostPx          = valuedPosOffsetFn(VS_SIBLING | VERT | ALIGN_END | TO_START | AT_MOST | BY_PX);
export const offsetPosFromSiblingTopByDefault           = zeroedPosOffsetFn(VS_SIBLING | VERT | ALIGN_END | TO_START | BY_DEFAULT);
export const offsetPosFromSiblingTopByDefaultFr         = valuedPosOffsetFn(VS_SIBLING | VERT | ALIGN_END | TO_START | BY_DEFAULT | BY_FR);
export const offsetPosFromSiblingTopByDefaultPx         = valuedPosOffsetFn(VS_SIBLING | VERT | ALIGN_END | TO_START | BY_DEFAULT | BY_PX);
export const offsetPosFromSiblingTopByFr                = valuedPosOffsetFn(VS_SIBLING | VERT | ALIGN_END | TO_START | BY_FR);
export const offsetPosFromSiblingTopByPx                = valuedPosOffsetFn(VS_SIBLING | VERT | ALIGN_END | TO_START | BY_PX);

// Size
export const sizeWidthByPx                              = sizeFn(VS_PARENT | HORZ | BY_PX);
export const sizeWidthByDefaultPx                       = sizeFn(VS_PARENT | HORZ | BY_DEFAULT | BY_PX);
export const sizeWidthByAtLeastPx                       = sizeFn(VS_PARENT | HORZ | AT_LEAST | BY_PX);
export const sizeWidthByAtMostPx                        = sizeFn(VS_PARENT | HORZ | AT_MOST | BY_PX);
export const sizeWidthByParentFr                        = sizeFn(VS_PARENT | HORZ | BY_FR);
export const sizeWidthByDefaultParentFr                 = sizeFn(VS_PARENT | HORZ | BY_DEFAULT | BY_FR);
export const sizeWidthByAtLeastParentFr                 = sizeFn(VS_PARENT | HORZ | AT_LEAST | BY_FR);
export const sizeWidthByAtMostParentFr                  = sizeFn(VS_PARENT | HORZ | AT_MOST | BY_FR);
export const sizeHeightByPx                             = sizeFn(VS_PARENT | VERT | BY_PX);
export const sizeHeightByDefaultPx                      = sizeFn(VS_PARENT | VERT | BY_DEFAULT | BY_PX);
export const sizeHeightByAtLeastPx                      = sizeFn(VS_PARENT | VERT | AT_LEAST | BY_PX);
export const sizeHeightByAtMostPx                       = sizeFn(VS_PARENT | VERT | AT_MOST | BY_PX);
export const sizeHeightByParentFr                       = sizeFn(VS_PARENT | VERT | BY_FR);
export const sizeHeightByDefaultParentFr                = sizeFn(VS_PARENT | VERT | BY_DEFAULT | BY_FR);
export const sizeHeightByAtLeastParentFr                = sizeFn(VS_PARENT | VERT | AT_LEAST | BY_FR);
export const sizeHeightByAtMostParentFr                 = sizeFn(VS_PARENT | VERT | AT_MOST | BY_FR);

// Offset Edge by Parent
export const offsetBottomFromParentBottom               = zeroedEdgeOffsetFn(VS_PARENT | VERT | ALIGN_END | TO_END | BY_PX);
export const offsetBottomFromParentBottomByAtLeastFr    = valuedEdgeOffsetFn(VS_PARENT | VERT | ALIGN_END | TO_END | AT_LEAST | BY_FR);
export const offsetBottomFromParentBottomByAtLeastPx    = valuedEdgeOffsetFn(VS_PARENT | VERT | ALIGN_END | TO_END | AT_LEAST | BY_PX);
export const offsetBottomFromParentBottomByAtMostFr     = valuedEdgeOffsetFn(VS_PARENT | VERT | ALIGN_END | TO_END | AT_MOST | BY_FR);
export const offsetBottomFromParentBottomByAtMostPx     = valuedEdgeOffsetFn(VS_PARENT | VERT | ALIGN_END | TO_END | AT_MOST | BY_PX);
export const offsetBottomFromParentBottomByDefaultFr    = valuedEdgeOffsetFn(VS_PARENT | VERT | ALIGN_END | TO_END | BY_DEFAULT | BY_FR);
export const offsetBottomFromParentBottomByDefaultPx    = valuedEdgeOffsetFn(VS_PARENT | VERT | ALIGN_END | TO_END | BY_DEFAULT | BY_PX);
export const offsetBottomFromParentBottomByFr           = valuedEdgeOffsetFn(VS_PARENT | VERT | ALIGN_END | TO_END | BY_FR);
export const offsetBottomFromParentBottomByPx           = valuedEdgeOffsetFn(VS_PARENT | VERT | ALIGN_END | TO_END | BY_PX);
export const offsetBottomFromParentTop                  = zeroedEdgeOffsetFn(VS_PARENT | VERT | ALIGN_END | TO_START | BY_PX);
export const offsetBottomFromParentTopByAtLeastFr       = valuedEdgeOffsetFn(VS_PARENT | VERT | ALIGN_END | TO_START | AT_LEAST | BY_FR);
export const offsetBottomFromParentTopByAtLeastPx       = valuedEdgeOffsetFn(VS_PARENT | VERT | ALIGN_END | TO_START | AT_LEAST | BY_PX);
export const offsetBottomFromParentTopByAtMostFr        = valuedEdgeOffsetFn(VS_PARENT | VERT | ALIGN_END | TO_START | AT_MOST | BY_FR);
export const offsetBottomFromParentTopByAtMostPx        = valuedEdgeOffsetFn(VS_PARENT | VERT | ALIGN_END | TO_START | AT_MOST | BY_PX);
export const offsetBottomFromParentTopByDefaultFr       = valuedEdgeOffsetFn(VS_PARENT | VERT | ALIGN_END | TO_START | BY_DEFAULT | BY_FR);
export const offsetBottomFromParentTopByDefaultPx       = valuedEdgeOffsetFn(VS_PARENT | VERT | ALIGN_END | TO_START | BY_DEFAULT | BY_PX);
export const offsetBottomFromParentTopByFr              = valuedEdgeOffsetFn(VS_PARENT | VERT | ALIGN_END | TO_START | BY_FR);
export const offsetBottomFromParentTopByPx              = valuedEdgeOffsetFn(VS_PARENT | VERT | ALIGN_END | TO_START | BY_PX);
export const offsetLeftFromParentLeft                   = zeroedEdgeOffsetFn(VS_PARENT | HORZ | ALIGN_START | TO_START | BY_PX);
export const offsetLeftFromParentLeftByAtLeastFr        = valuedEdgeOffsetFn(VS_PARENT | HORZ | ALIGN_START | TO_START | AT_LEAST | BY_FR);
export const offsetLeftFromParentLeftByAtLeastPx        = valuedEdgeOffsetFn(VS_PARENT | HORZ | ALIGN_START | TO_START | AT_LEAST | BY_PX);
export const offsetLeftFromParentLeftByAtMostFr         = valuedEdgeOffsetFn(VS_PARENT | HORZ | ALIGN_START | TO_START | AT_MOST | BY_FR);
export const offsetLeftFromParentLeftByAtMostPx         = valuedEdgeOffsetFn(VS_PARENT | HORZ | ALIGN_START | TO_START | AT_MOST | BY_PX);
export const offsetLeftFromParentLeftByDefaultFr        = valuedEdgeOffsetFn(VS_PARENT | HORZ | ALIGN_START | TO_START | BY_DEFAULT | BY_FR);
export const offsetLeftFromParentLeftByDefaultPx        = valuedEdgeOffsetFn(VS_PARENT | HORZ | ALIGN_START | TO_START | BY_DEFAULT | BY_PX);
export const offsetLeftFromParentLeftByFr               = valuedEdgeOffsetFn(VS_PARENT | HORZ | ALIGN_START | TO_START | BY_FR);
export const offsetLeftFromParentLeftByPx               = valuedEdgeOffsetFn(VS_PARENT | HORZ | ALIGN_START | TO_START | BY_PX);
export const offsetLeftFromParentRight                  = zeroedEdgeOffsetFn(VS_PARENT | HORZ | ALIGN_START | TO_END | BY_PX);
export const offsetLeftFromParentRightByAtLeastFr       = valuedEdgeOffsetFn(VS_PARENT | HORZ | ALIGN_START | TO_END | AT_LEAST | BY_FR);
export const offsetLeftFromParentRightByAtLeastPx       = valuedEdgeOffsetFn(VS_PARENT | HORZ | ALIGN_START | TO_END | AT_LEAST | BY_PX);
export const offsetLeftFromParentRightByAtMostFr        = valuedEdgeOffsetFn(VS_PARENT | HORZ | ALIGN_START | TO_END | AT_MOST | BY_FR);
export const offsetLeftFromParentRightByAtMostPx        = valuedEdgeOffsetFn(VS_PARENT | HORZ | ALIGN_START | TO_END | AT_MOST | BY_PX);
export const offsetLeftFromParentRightByDefaultFr       = valuedEdgeOffsetFn(VS_PARENT | HORZ | ALIGN_START | TO_END | BY_DEFAULT | BY_FR);
export const offsetLeftFromParentRightByDefaultPx       = valuedEdgeOffsetFn(VS_PARENT | HORZ | ALIGN_START | TO_END | BY_DEFAULT | BY_PX);
export const offsetLeftFromParentRightByFr              = valuedEdgeOffsetFn(VS_PARENT | HORZ | ALIGN_START | TO_END | BY_FR);
export const offsetLeftFromParentRightByPx              = valuedEdgeOffsetFn(VS_PARENT | HORZ | ALIGN_START | TO_END | BY_PX);
export const offsetRightFromParentLeft                  = zeroedEdgeOffsetFn(VS_PARENT | HORZ | ALIGN_END | TO_START | BY_PX);
export const offsetRightFromParentLeftByAtLeastFr       = valuedEdgeOffsetFn(VS_PARENT | HORZ | ALIGN_END | TO_START | AT_LEAST | BY_FR);
export const offsetRightFromParentLeftByAtLeastPx       = valuedEdgeOffsetFn(VS_PARENT | HORZ | ALIGN_END | TO_START | AT_LEAST | BY_PX);
export const offsetRightFromParentLeftByAtMostFr        = valuedEdgeOffsetFn(VS_PARENT | HORZ | ALIGN_END | TO_START | AT_MOST | BY_FR);
export const offsetRightFromParentLeftByAtMostPx        = valuedEdgeOffsetFn(VS_PARENT | HORZ | ALIGN_END | TO_START | AT_MOST | BY_PX);
export const offsetRightFromParentLeftByDefaultFr       = valuedEdgeOffsetFn(VS_PARENT | HORZ | ALIGN_END | TO_START | BY_DEFAULT | BY_FR);
export const offsetRightFromParentLeftByDefaultPx       = valuedEdgeOffsetFn(VS_PARENT | HORZ | ALIGN_END | TO_START | BY_DEFAULT | BY_PX);
export const offsetRightFromParentLeftByFr              = valuedEdgeOffsetFn(VS_PARENT | HORZ | ALIGN_END | TO_START | BY_FR);
export const offsetRightFromParentLeftByPx              = valuedEdgeOffsetFn(VS_PARENT | HORZ | ALIGN_END | TO_START | BY_PX);
export const offsetRightFromParentRight                 = zeroedEdgeOffsetFn(VS_PARENT | HORZ | ALIGN_END | TO_END | BY_PX);
export const offsetRightFromParentRightByAtLeastFr      = valuedEdgeOffsetFn(VS_PARENT | HORZ | ALIGN_END | TO_END | AT_LEAST | BY_FR);
export const offsetRightFromParentRightByAtLeastPx      = valuedEdgeOffsetFn(VS_PARENT | HORZ | ALIGN_END | TO_END | AT_LEAST | BY_PX);
export const offsetRightFromParentRightByAtMostFr       = valuedEdgeOffsetFn(VS_PARENT | HORZ | ALIGN_END | TO_END | AT_MOST | BY_FR);
export const offsetRightFromParentRightByAtMostPx       = valuedEdgeOffsetFn(VS_PARENT | HORZ | ALIGN_END | TO_END | AT_MOST | BY_PX);
export const offsetRightFromParentRightByDefaultFr      = valuedEdgeOffsetFn(VS_PARENT | HORZ | ALIGN_END | TO_END | BY_DEFAULT | BY_FR);
export const offsetRightFromParentRightByDefaultPx      = valuedEdgeOffsetFn(VS_PARENT | HORZ | ALIGN_END | TO_END | BY_DEFAULT | BY_PX);
export const offsetRightFromParentRightByFr             = valuedEdgeOffsetFn(VS_PARENT | HORZ | ALIGN_END | TO_END | BY_FR);
export const offsetRightFromParentRightByPx             = valuedEdgeOffsetFn(VS_PARENT | HORZ | ALIGN_END | TO_END | BY_PX);
export const offsetTopFromParentBottom                  = zeroedEdgeOffsetFn(VS_PARENT | VERT | ALIGN_START | TO_END | BY_PX);
export const offsetTopFromParentBottomByAtLeastFr       = valuedEdgeOffsetFn(VS_PARENT | VERT | ALIGN_START | TO_END | AT_LEAST | BY_FR);
export const offsetTopFromParentBottomByAtLeastPx       = valuedEdgeOffsetFn(VS_PARENT | VERT | ALIGN_START | TO_END | AT_LEAST | BY_PX);
export const offsetTopFromParentBottomByAtMostFr        = valuedEdgeOffsetFn(VS_PARENT | VERT | ALIGN_START | TO_END | AT_MOST | BY_FR);
export const offsetTopFromParentBottomByAtMostPx        = valuedEdgeOffsetFn(VS_PARENT | VERT | ALIGN_START | TO_END | AT_MOST | BY_PX);
export const offsetTopFromParentBottomByDefaultFr       = valuedEdgeOffsetFn(VS_PARENT | VERT | ALIGN_START | TO_END | BY_DEFAULT | BY_FR);
export const offsetTopFromParentBottomByDefaultPx       = valuedEdgeOffsetFn(VS_PARENT | VERT | ALIGN_START | TO_END | BY_DEFAULT | BY_PX);
export const offsetTopFromParentBottomByFr              = valuedEdgeOffsetFn(VS_PARENT | VERT | ALIGN_START | TO_END | BY_FR);
export const offsetTopFromParentBottomByPx              = valuedEdgeOffsetFn(VS_PARENT | VERT | ALIGN_START | TO_END | BY_PX);
export const offsetTopFromParentTop                     = zeroedEdgeOffsetFn(VS_PARENT | VERT | ALIGN_START | TO_START | BY_PX);
export const offsetTopFromParentTopByAtLeastFr          = valuedEdgeOffsetFn(VS_PARENT | VERT | ALIGN_START | TO_START | AT_LEAST | BY_FR);
export const offsetTopFromParentTopByAtLeastPx          = valuedEdgeOffsetFn(VS_PARENT | VERT | ALIGN_START | TO_START | AT_LEAST | BY_PX);
export const offsetTopFromParentTopByAtMostFr           = valuedEdgeOffsetFn(VS_PARENT | VERT | ALIGN_START | TO_START | AT_MOST | BY_FR);
export const offsetTopFromParentTopByAtMostPx           = valuedEdgeOffsetFn(VS_PARENT | VERT | ALIGN_START | TO_START | AT_MOST | BY_PX);
export const offsetTopFromParentTopByDefaultFr          = valuedEdgeOffsetFn(VS_PARENT | VERT | ALIGN_START | TO_START | BY_DEFAULT | BY_FR);
export const offsetTopFromParentTopByDefaultPx          = valuedEdgeOffsetFn(VS_PARENT | VERT | ALIGN_START | TO_START | BY_DEFAULT | BY_PX);
export const offsetTopFromParentTopByFr                 = valuedEdgeOffsetFn(VS_PARENT | VERT | ALIGN_START | TO_START | BY_FR);
export const offsetTopFromParentTopByPx                 = valuedEdgeOffsetFn(VS_PARENT | VERT | ALIGN_START | TO_START | BY_PX);

// Offset Edge by Sibling
export const offsetBottomFromSiblingBottom              = zeroedEdgeOffsetFn(VS_SIBLING | VERT | ALIGN_END | TO_END | BY_PX);
export const offsetBottomFromSiblingBottomByAtLeastFr   = valuedEdgeOffsetFn(VS_SIBLING | VERT | ALIGN_END | TO_END | AT_LEAST | BY_FR);
export const offsetBottomFromSiblingBottomByAtLeastPx   = valuedEdgeOffsetFn(VS_SIBLING | VERT | ALIGN_END | TO_END | AT_LEAST | BY_PX);
export const offsetBottomFromSiblingBottomByAtMostFr    = valuedEdgeOffsetFn(VS_SIBLING | VERT | ALIGN_END | TO_END | AT_MOST | BY_FR);
export const offsetBottomFromSiblingBottomByAtMostPx    = valuedEdgeOffsetFn(VS_SIBLING | VERT | ALIGN_END | TO_END | AT_MOST | BY_PX);
export const offsetBottomFromSiblingBottomByDefaultFr   = valuedEdgeOffsetFn(VS_SIBLING | VERT | ALIGN_END | TO_END | BY_DEFAULT | BY_FR);
export const offsetBottomFromSiblingBottomByDefaultPx   = valuedEdgeOffsetFn(VS_SIBLING | VERT | ALIGN_END | TO_END | BY_DEFAULT | BY_PX);
export const offsetBottomFromSiblingBottomByFr          = valuedEdgeOffsetFn(VS_SIBLING | VERT | ALIGN_END | TO_END | BY_FR);
export const offsetBottomFromSiblingBottomByPx          = valuedEdgeOffsetFn(VS_SIBLING | VERT | ALIGN_END | TO_END | BY_PX);
export const offsetBottomFromSiblingTop                 = zeroedEdgeOffsetFn(VS_SIBLING | VERT | ALIGN_END | TO_START | BY_PX);
export const offsetBottomFromSiblingTopByAtLeastFr      = valuedEdgeOffsetFn(VS_SIBLING | VERT | ALIGN_END | TO_START | AT_LEAST | BY_FR);
export const offsetBottomFromSiblingTopByAtLeastPx      = valuedEdgeOffsetFn(VS_SIBLING | VERT | ALIGN_END | TO_START | AT_LEAST | BY_PX);
export const offsetBottomFromSiblingTopByAtMostFr       = valuedEdgeOffsetFn(VS_SIBLING | VERT | ALIGN_END | TO_START | AT_MOST | BY_FR);
export const offsetBottomFromSiblingTopByAtMostPx       = valuedEdgeOffsetFn(VS_SIBLING | VERT | ALIGN_END | TO_START | AT_MOST | BY_PX);
export const offsetBottomFromSiblingTopByDefaultFr      = valuedEdgeOffsetFn(VS_SIBLING | VERT | ALIGN_END | TO_START | BY_DEFAULT | BY_FR);
export const offsetBottomFromSiblingTopByDefaultPx      = valuedEdgeOffsetFn(VS_SIBLING | VERT | ALIGN_END | TO_START | BY_DEFAULT | BY_PX);
export const offsetBottomFromSiblingTopByFr             = valuedEdgeOffsetFn(VS_SIBLING | VERT | ALIGN_END | TO_START | BY_FR);
export const offsetBottomFromSiblingTopByPx             = valuedEdgeOffsetFn(VS_SIBLING | VERT | ALIGN_END | TO_START | BY_PX);
export const offsetLeftFromSiblingLeft                  = zeroedEdgeOffsetFn(VS_SIBLING | HORZ | ALIGN_START | TO_START | BY_PX);
export const offsetLeftFromSiblingLeftByAtLeastFr       = valuedEdgeOffsetFn(VS_SIBLING | HORZ | ALIGN_START | TO_START | AT_LEAST | BY_FR);
export const offsetLeftFromSiblingLeftByAtLeastPx       = valuedEdgeOffsetFn(VS_SIBLING | HORZ | ALIGN_START | TO_START | AT_LEAST | BY_PX);
export const offsetLeftFromSiblingLeftByAtMostFr        = valuedEdgeOffsetFn(VS_SIBLING | HORZ | ALIGN_START | TO_START | AT_MOST | BY_FR);
export const offsetLeftFromSiblingLeftByAtMostPx        = valuedEdgeOffsetFn(VS_SIBLING | HORZ | ALIGN_START | TO_START | AT_MOST | BY_PX);
export const offsetLeftFromSiblingLeftByDefaultFr       = valuedEdgeOffsetFn(VS_SIBLING | HORZ | ALIGN_START | TO_START | BY_DEFAULT | BY_FR);
export const offsetLeftFromSiblingLeftByDefaultPx       = valuedEdgeOffsetFn(VS_SIBLING | HORZ | ALIGN_START | TO_START | BY_DEFAULT | BY_PX);
export const offsetLeftFromSiblingLeftByFr              = valuedEdgeOffsetFn(VS_SIBLING | HORZ | ALIGN_START | TO_START | BY_FR);
export const offsetLeftFromSiblingLeftByPx              = valuedEdgeOffsetFn(VS_SIBLING | HORZ | ALIGN_START | TO_START | BY_PX);
export const offsetLeftFromSiblingRight                 = zeroedEdgeOffsetFn(VS_SIBLING | HORZ | ALIGN_START | TO_END | BY_PX);
export const offsetLeftFromSiblingRightByAtLeastFr      = valuedEdgeOffsetFn(VS_SIBLING | HORZ | ALIGN_START | TO_END | AT_LEAST | BY_FR);
export const offsetLeftFromSiblingRightByAtLeastPx      = valuedEdgeOffsetFn(VS_SIBLING | HORZ | ALIGN_START | TO_END | AT_LEAST | BY_PX);
export const offsetLeftFromSiblingRightByAtMostFr       = valuedEdgeOffsetFn(VS_SIBLING | HORZ | ALIGN_START | TO_END | AT_MOST | BY_FR);
export const offsetLeftFromSiblingRightByAtMostPx       = valuedEdgeOffsetFn(VS_SIBLING | HORZ | ALIGN_START | TO_END | AT_MOST | BY_PX);
export const offsetLeftFromSiblingRightByDefaultFr      = valuedEdgeOffsetFn(VS_SIBLING | HORZ | ALIGN_START | TO_END | BY_DEFAULT | BY_FR);
export const offsetLeftFromSiblingRightByDefaultPx      = valuedEdgeOffsetFn(VS_SIBLING | HORZ | ALIGN_START | TO_END | BY_DEFAULT | BY_PX);
export const offsetLeftFromSiblingRightByFr             = valuedEdgeOffsetFn(VS_SIBLING | HORZ | ALIGN_START | TO_END | BY_FR);
export const offsetLeftFromSiblingRightByPx             = valuedEdgeOffsetFn(VS_SIBLING | HORZ | ALIGN_START | TO_END | BY_PX);
export const offsetRightFromSiblingLeft                 = zeroedEdgeOffsetFn(VS_SIBLING | HORZ | ALIGN_END | TO_START | BY_PX);
export const offsetRightFromSiblingLeftByAtLeastFr      = valuedEdgeOffsetFn(VS_SIBLING | HORZ | ALIGN_END | TO_START | AT_LEAST | BY_FR);
export const offsetRightFromSiblingLeftByAtLeastPx      = valuedEdgeOffsetFn(VS_SIBLING | HORZ | ALIGN_END | TO_START | AT_LEAST | BY_PX);
export const offsetRightFromSiblingLeftByAtMostFr       = valuedEdgeOffsetFn(VS_SIBLING | HORZ | ALIGN_END | TO_START | AT_MOST | BY_FR);
export const offsetRightFromSiblingLeftByAtMostPx       = valuedEdgeOffsetFn(VS_SIBLING | HORZ | ALIGN_END | TO_START | AT_MOST | BY_PX);
export const offsetRightFromSiblingLeftByDefaultFr      = valuedEdgeOffsetFn(VS_SIBLING | HORZ | ALIGN_END | TO_START | BY_DEFAULT | BY_FR);
export const offsetRightFromSiblingLeftByDefaultPx      = valuedEdgeOffsetFn(VS_SIBLING | HORZ | ALIGN_END | TO_START | BY_DEFAULT | BY_PX);
export const offsetRightFromSiblingLeftByFr             = valuedEdgeOffsetFn(VS_SIBLING | HORZ | ALIGN_END | TO_START | BY_FR);
export const offsetRightFromSiblingLeftByPx             = valuedEdgeOffsetFn(VS_SIBLING | HORZ | ALIGN_END | TO_START | BY_PX);
export const offsetRightFromSiblingRight                = zeroedEdgeOffsetFn(VS_SIBLING | HORZ | ALIGN_END | TO_END | BY_PX);
export const offsetRightFromSiblingRightByAtLeastFr     = valuedEdgeOffsetFn(VS_SIBLING | HORZ | ALIGN_END | TO_END | AT_LEAST | BY_FR);
export const offsetRightFromSiblingRightByAtLeastPx     = valuedEdgeOffsetFn(VS_SIBLING | HORZ | ALIGN_END | TO_END | AT_LEAST | BY_PX);
export const offsetRightFromSiblingRightByAtMostFr      = valuedEdgeOffsetFn(VS_SIBLING | HORZ | ALIGN_END | TO_END | AT_MOST | BY_FR);
export const offsetRightFromSiblingRightByAtMostPx      = valuedEdgeOffsetFn(VS_SIBLING | HORZ | ALIGN_END | TO_END | AT_MOST | BY_PX);
export const offsetRightFromSiblingRightByDefaultFr     = valuedEdgeOffsetFn(VS_SIBLING | HORZ | ALIGN_END | TO_END | BY_DEFAULT | BY_FR);
export const offsetRightFromSiblingRightByDefaultPx     = valuedEdgeOffsetFn(VS_SIBLING | HORZ | ALIGN_END | TO_END | BY_DEFAULT | BY_PX);
export const offsetRightFromSiblingRightByFr            = valuedEdgeOffsetFn(VS_SIBLING | HORZ | ALIGN_END | TO_END | BY_FR);
export const offsetRightFromSiblingRightByPx            = valuedEdgeOffsetFn(VS_SIBLING | HORZ | ALIGN_END | TO_END | BY_PX);
export const offsetTopFromSiblingBottom                 = zeroedEdgeOffsetFn(VS_SIBLING | VERT | ALIGN_START | TO_END | BY_PX);
export const offsetTopFromSiblingBottomByAtLeastFr      = valuedEdgeOffsetFn(VS_SIBLING | VERT | ALIGN_START | TO_END | AT_LEAST | BY_FR);
export const offsetTopFromSiblingBottomByAtLeastPx      = valuedEdgeOffsetFn(VS_SIBLING | VERT | ALIGN_START | TO_END | AT_LEAST | BY_PX);
export const offsetTopFromSiblingBottomByAtMostFr       = valuedEdgeOffsetFn(VS_SIBLING | VERT | ALIGN_START | TO_END | AT_MOST | BY_FR);
export const offsetTopFromSiblingBottomByAtMostPx       = valuedEdgeOffsetFn(VS_SIBLING | VERT | ALIGN_START | TO_END | AT_MOST | BY_PX);
export const offsetTopFromSiblingBottomByDefaultFr      = valuedEdgeOffsetFn(VS_SIBLING | VERT | ALIGN_START | TO_END | BY_DEFAULT | BY_FR);
export const offsetTopFromSiblingBottomByDefaultPx      = valuedEdgeOffsetFn(VS_SIBLING | VERT | ALIGN_START | TO_END | BY_DEFAULT | BY_PX);
export const offsetTopFromSiblingBottomByFr             = valuedEdgeOffsetFn(VS_SIBLING | VERT | ALIGN_START | TO_END | BY_FR);
export const offsetTopFromSiblingBottomByPx             = valuedEdgeOffsetFn(VS_SIBLING | VERT | ALIGN_START | TO_END | BY_PX);
export const offsetTopFromSiblingTop                    = zeroedEdgeOffsetFn(VS_SIBLING | VERT | ALIGN_START | TO_START | BY_PX);
export const offsetTopFromSiblingTopByAtLeastFr         = valuedEdgeOffsetFn(VS_SIBLING | VERT | ALIGN_START | TO_START | AT_LEAST | BY_FR);
export const offsetTopFromSiblingTopByAtLeastPx         = valuedEdgeOffsetFn(VS_SIBLING | VERT | ALIGN_START | TO_START | AT_LEAST | BY_PX);
export const offsetTopFromSiblingTopByAtMostFr          = valuedEdgeOffsetFn(VS_SIBLING | VERT | ALIGN_START | TO_START | AT_MOST | BY_FR);
export const offsetTopFromSiblingTopByAtMostPx          = valuedEdgeOffsetFn(VS_SIBLING | VERT | ALIGN_START | TO_START | AT_MOST | BY_PX);
export const offsetTopFromSiblingTopByDefaultFr         = valuedEdgeOffsetFn(VS_SIBLING | VERT | ALIGN_START | TO_START | BY_DEFAULT | BY_FR);
export const offsetTopFromSiblingTopByDefaultPx         = valuedEdgeOffsetFn(VS_SIBLING | VERT | ALIGN_START | TO_START | BY_DEFAULT | BY_PX);
export const offsetTopFromSiblingTopByFr                = valuedEdgeOffsetFn(VS_SIBLING | VERT | ALIGN_START | TO_START | BY_FR);
export const offsetTopFromSiblingTopByPx                = valuedEdgeOffsetFn(VS_SIBLING | VERT | ALIGN_START | TO_START | BY_PX);

// Offset Edge by Children
export const offsetBottomFromChildBottom                = zeroedEdgeOffsetFn(VS_CHILDREN | VERT | ALIGN_END | TO_END | BY_PX);
export const offsetBottomFromChildBottomByAtLeastFr     = valuedEdgeOffsetFn(VS_CHILDREN | VERT | ALIGN_END | TO_END | AT_LEAST | BY_FR);
export const offsetBottomFromChildBottomByAtLeastPx     = valuedEdgeOffsetFn(VS_CHILDREN | VERT | ALIGN_END | TO_END | AT_LEAST | BY_PX);
export const offsetBottomFromChildBottomByAtMostFr      = valuedEdgeOffsetFn(VS_CHILDREN | VERT | ALIGN_END | TO_END | AT_MOST | BY_FR);
export const offsetBottomFromChildBottomByAtMostPx      = valuedEdgeOffsetFn(VS_CHILDREN | VERT | ALIGN_END | TO_END | AT_MOST | BY_PX);
export const offsetBottomFromChildBottomByDefaultFr     = valuedEdgeOffsetFn(VS_CHILDREN | VERT | ALIGN_END | TO_END | BY_DEFAULT | BY_FR);
export const offsetBottomFromChildBottomByDefaultPx     = valuedEdgeOffsetFn(VS_CHILDREN | VERT | ALIGN_END | TO_END | BY_DEFAULT | BY_PX);
export const offsetBottomFromChildBottomByFr            = valuedEdgeOffsetFn(VS_CHILDREN | VERT | ALIGN_END | TO_END | BY_FR);
export const offsetBottomFromChildBottomByPx            = valuedEdgeOffsetFn(VS_CHILDREN | VERT | ALIGN_END | TO_END | BY_PX);
export const offsetBottomFromChildTop                   = zeroedEdgeOffsetFn(VS_CHILDREN | VERT | ALIGN_END | TO_START | BY_PX);
export const offsetBottomFromChildTopByAtLeastFr        = valuedEdgeOffsetFn(VS_CHILDREN | VERT | ALIGN_END | TO_START | AT_LEAST | BY_FR);
export const offsetBottomFromChildTopByAtLeastPx        = valuedEdgeOffsetFn(VS_CHILDREN | VERT | ALIGN_END | TO_START | AT_LEAST | BY_PX);
export const offsetBottomFromChildTopByAtMostFr         = valuedEdgeOffsetFn(VS_CHILDREN | VERT | ALIGN_END | TO_START | AT_MOST | BY_FR);
export const offsetBottomFromChildTopByAtMostPx         = valuedEdgeOffsetFn(VS_CHILDREN | VERT | ALIGN_END | TO_START | AT_MOST | BY_PX);
export const offsetBottomFromChildTopByDefaultFr        = valuedEdgeOffsetFn(VS_CHILDREN | VERT | ALIGN_END | TO_START | BY_DEFAULT | BY_FR);
export const offsetBottomFromChildTopByDefaultPx        = valuedEdgeOffsetFn(VS_CHILDREN | VERT | ALIGN_END | TO_START | BY_DEFAULT | BY_PX);
export const offsetBottomFromChildTopByFr               = valuedEdgeOffsetFn(VS_CHILDREN | VERT | ALIGN_END | TO_START | BY_FR);
export const offsetBottomFromChildTopByPx               = valuedEdgeOffsetFn(VS_CHILDREN | VERT | ALIGN_END | TO_START | BY_PX);
export const offsetLeftFromChildLeft                    = zeroedEdgeOffsetFn(VS_CHILDREN | HORZ | ALIGN_START | TO_START | BY_PX);
export const offsetLeftFromChildLeftByAtLeastFr         = valuedEdgeOffsetFn(VS_CHILDREN | HORZ | ALIGN_START | TO_START | AT_LEAST | BY_FR);
export const offsetLeftFromChildLeftByAtLeastPx         = valuedEdgeOffsetFn(VS_CHILDREN | HORZ | ALIGN_START | TO_START | AT_LEAST | BY_PX);
export const offsetLeftFromChildLeftByAtMostFr          = valuedEdgeOffsetFn(VS_CHILDREN | HORZ | ALIGN_START | TO_START | AT_MOST | BY_FR);
export const offsetLeftFromChildLeftByAtMostPx          = valuedEdgeOffsetFn(VS_CHILDREN | HORZ | ALIGN_START | TO_START | AT_MOST | BY_PX);
export const offsetLeftFromChildLeftByDefaultFr         = valuedEdgeOffsetFn(VS_CHILDREN | HORZ | ALIGN_START | TO_START | BY_DEFAULT | BY_FR);
export const offsetLeftFromChildLeftByDefaultPx         = valuedEdgeOffsetFn(VS_CHILDREN | HORZ | ALIGN_START | TO_START | BY_DEFAULT | BY_PX);
export const offsetLeftFromChildLeftByFr                = valuedEdgeOffsetFn(VS_CHILDREN | HORZ | ALIGN_START | TO_START | BY_FR);
export const offsetLeftFromChildLeftByPx                = valuedEdgeOffsetFn(VS_CHILDREN | HORZ | ALIGN_START | TO_START | BY_PX);
export const offsetLeftFromChildRight                   = zeroedEdgeOffsetFn(VS_CHILDREN | HORZ | ALIGN_START | TO_END | BY_PX);
export const offsetLeftFromChildRightByAtLeastFr        = valuedEdgeOffsetFn(VS_CHILDREN | HORZ | ALIGN_START | TO_END | AT_LEAST | BY_FR);
export const offsetLeftFromChildRightByAtLeastPx        = valuedEdgeOffsetFn(VS_CHILDREN | HORZ | ALIGN_START | TO_END | AT_LEAST | BY_PX);
export const offsetLeftFromChildRightByAtMostFr         = valuedEdgeOffsetFn(VS_CHILDREN | HORZ | ALIGN_START | TO_END | AT_MOST | BY_FR);
export const offsetLeftFromChildRightByAtMostPx         = valuedEdgeOffsetFn(VS_CHILDREN | HORZ | ALIGN_START | TO_END | AT_MOST | BY_PX);
export const offsetLeftFromChildRightByDefaultFr        = valuedEdgeOffsetFn(VS_CHILDREN | HORZ | ALIGN_START | TO_END | BY_DEFAULT | BY_FR);
export const offsetLeftFromChildRightByDefaultPx        = valuedEdgeOffsetFn(VS_CHILDREN | HORZ | ALIGN_START | TO_END | BY_DEFAULT | BY_PX);
export const offsetLeftFromChildRightByFr               = valuedEdgeOffsetFn(VS_CHILDREN | HORZ | ALIGN_START | TO_END | BY_FR);
export const offsetLeftFromChildRightByPx               = valuedEdgeOffsetFn(VS_CHILDREN | HORZ | ALIGN_START | TO_END | BY_PX);
export const offsetRightFromChildLeft                   = zeroedEdgeOffsetFn(VS_CHILDREN | HORZ | ALIGN_END | TO_START | BY_PX);
export const offsetRightFromChildLeftByAtLeastFr        = valuedEdgeOffsetFn(VS_CHILDREN | HORZ | ALIGN_END | TO_START | AT_LEAST | BY_FR);
export const offsetRightFromChildLeftByAtLeastPx        = valuedEdgeOffsetFn(VS_CHILDREN | HORZ | ALIGN_END | TO_START | AT_LEAST | BY_PX);
export const offsetRightFromChildLeftByAtMostFr         = valuedEdgeOffsetFn(VS_CHILDREN | HORZ | ALIGN_END | TO_START | AT_MOST | BY_FR);
export const offsetRightFromChildLeftByAtMostPx         = valuedEdgeOffsetFn(VS_CHILDREN | HORZ | ALIGN_END | TO_START | AT_MOST | BY_PX);
export const offsetRightFromChildLeftByDefaultFr        = valuedEdgeOffsetFn(VS_CHILDREN | HORZ | ALIGN_END | TO_START | BY_DEFAULT | BY_FR);
export const offsetRightFromChildLeftByDefaultPx        = valuedEdgeOffsetFn(VS_CHILDREN | HORZ | ALIGN_END | TO_START | BY_DEFAULT | BY_PX);
export const offsetRightFromChildLeftByFr               = valuedEdgeOffsetFn(VS_CHILDREN | HORZ | ALIGN_END | TO_START | BY_FR);
export const offsetRightFromChildLeftByPx               = valuedEdgeOffsetFn(VS_CHILDREN | HORZ | ALIGN_END | TO_START | BY_PX);
export const offsetRightFromChildRight                  = zeroedEdgeOffsetFn(VS_CHILDREN | HORZ | ALIGN_END | TO_END | BY_PX);
export const offsetRightFromChildRightByAtLeastFr       = valuedEdgeOffsetFn(VS_CHILDREN | HORZ | ALIGN_END | TO_END | AT_LEAST | BY_FR);
export const offsetRightFromChildRightByAtLeastPx       = valuedEdgeOffsetFn(VS_CHILDREN | HORZ | ALIGN_END | TO_END | AT_LEAST | BY_PX);
export const offsetRightFromChildRightByAtMostFr        = valuedEdgeOffsetFn(VS_CHILDREN | HORZ | ALIGN_END | TO_END | AT_MOST | BY_FR);
export const offsetRightFromChildRightByAtMostPx        = valuedEdgeOffsetFn(VS_CHILDREN | HORZ | ALIGN_END | TO_END | AT_MOST | BY_PX);
export const offsetRightFromChildRightByDefaultFr       = valuedEdgeOffsetFn(VS_CHILDREN | HORZ | ALIGN_END | TO_END | BY_DEFAULT | BY_FR);
export const offsetRightFromChildRightByDefaultPx       = valuedEdgeOffsetFn(VS_CHILDREN | HORZ | ALIGN_END | TO_END | BY_DEFAULT | BY_PX);
export const offsetRightFromChildRightByFr              = valuedEdgeOffsetFn(VS_CHILDREN | HORZ | ALIGN_END | TO_END | BY_FR);
export const offsetRightFromChildRightByPx              = valuedEdgeOffsetFn(VS_CHILDREN | HORZ | ALIGN_END | TO_END | BY_PX);
export const offsetTopFromChildBottom                   = zeroedEdgeOffsetFn(VS_CHILDREN | VERT | ALIGN_START | TO_END | BY_PX);
export const offsetTopFromChildBottomByAtLeastFr        = valuedEdgeOffsetFn(VS_CHILDREN | VERT | ALIGN_START | TO_END | AT_LEAST | BY_FR);
export const offsetTopFromChildBottomByAtLeastPx        = valuedEdgeOffsetFn(VS_CHILDREN | VERT | ALIGN_START | TO_END | AT_LEAST | BY_PX);
export const offsetTopFromChildBottomByAtMostFr         = valuedEdgeOffsetFn(VS_CHILDREN | VERT | ALIGN_START | TO_END | AT_MOST | BY_FR);
export const offsetTopFromChildBottomByAtMostPx         = valuedEdgeOffsetFn(VS_CHILDREN | VERT | ALIGN_START | TO_END | AT_MOST | BY_PX);
export const offsetTopFromChildBottomByDefaultFr        = valuedEdgeOffsetFn(VS_CHILDREN | VERT | ALIGN_START | TO_END | BY_DEFAULT | BY_FR);
export const offsetTopFromChildBottomByDefaultPx        = valuedEdgeOffsetFn(VS_CHILDREN | VERT | ALIGN_START | TO_END | BY_DEFAULT | BY_PX);
export const offsetTopFromChildBottomByFr               = valuedEdgeOffsetFn(VS_CHILDREN | VERT | ALIGN_START | TO_END | BY_FR);
export const offsetTopFromChildBottomByPx               = valuedEdgeOffsetFn(VS_CHILDREN | VERT | ALIGN_START | TO_END | BY_PX);
export const offsetTopFromChildTop                      = zeroedEdgeOffsetFn(VS_CHILDREN | VERT | ALIGN_START | TO_START | BY_PX);
export const offsetTopFromChildTopByAtLeastFr           = valuedEdgeOffsetFn(VS_CHILDREN | VERT | ALIGN_START | TO_START | AT_LEAST | BY_FR);
export const offsetTopFromChildTopByAtLeastPx           = valuedEdgeOffsetFn(VS_CHILDREN | VERT | ALIGN_START | TO_START | AT_LEAST | BY_PX);
export const offsetTopFromChildTopByAtMostFr            = valuedEdgeOffsetFn(VS_CHILDREN | VERT | ALIGN_START | TO_START | AT_MOST | BY_FR);
export const offsetTopFromChildTopByAtMostPx            = valuedEdgeOffsetFn(VS_CHILDREN | VERT | ALIGN_START | TO_START | AT_MOST | BY_PX);
export const offsetTopFromChildTopByDefaultFr           = valuedEdgeOffsetFn(VS_CHILDREN | VERT | ALIGN_START | TO_START | BY_DEFAULT | BY_FR);
export const offsetTopFromChildTopByDefaultPx           = valuedEdgeOffsetFn(VS_CHILDREN | VERT | ALIGN_START | TO_START | BY_DEFAULT | BY_PX);
export const offsetTopFromChildTopByFr                  = valuedEdgeOffsetFn(VS_CHILDREN | VERT | ALIGN_START | TO_START | BY_FR);
export const offsetTopFromChildTopByPx                  = valuedEdgeOffsetFn(VS_CHILDREN | VERT | ALIGN_START | TO_START | BY_PX);
