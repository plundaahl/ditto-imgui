import { StyledDittoContext } from '../../../src/StyledDittoImGui';
import { flagFactory } from '../../../src/DittoImGui/lib/FlagFactory';

const flag = flagFactory();

export const WITH_BORDER = flag();
export const WITH_PADDING = flag();
export const AUTOFILL_WIDTH = flag();

const defaultFlags: number = AUTOFILL_WIDTH | WITH_PADDING;

export function createVerticalLayout(
    gui: StyledDittoContext,
    flags: number = defaultFlags,
) {
    const padding = flags & WITH_PADDING ? gui.boxSize.getPadding() : 0;
    const border = flags & WITH_BORDER ? gui.boxSize.getBorderWidth() : 0;
    const borderAndPadding = padding + border;
    const borderAndPaddingX2 = borderAndPadding * 2;

    return () => {
        const siblingBounds = gui.bounds.getSiblingBounds();
        const elementBounds = gui.bounds.getElementBounds();
        const parentBounds = gui.bounds.getParentBounds();

        if (!parentBounds) {
            return;
        }

        if (siblingBounds.h > 0) {
            elementBounds.y = siblingBounds.y + siblingBounds.h + padding;
        } else {
            elementBounds.y = parentBounds.y + borderAndPadding;
        }
        elementBounds.x = parentBounds.x + borderAndPadding;

        if (flags & AUTOFILL_WIDTH) {
            elementBounds.w = parentBounds.w - borderAndPaddingX2;
        }
    }
}
