import { StyledDittoContext } from '../../../src/StyledDittoImGui';
import { flagFactory } from '../../../src/DittoImGui/lib/FlagFactory';

const flag = flagFactory();

export const WITH_BORDER = flag();
export const WITH_PADDING = flag();

const defaultFlags: number = 0;

export function createFillLayout(
    gui: StyledDittoContext,
    flags: number = defaultFlags,
) {
    const padding = flags & WITH_PADDING ? gui.boxSize.getPadding() : 0;
    const border = flags & WITH_BORDER ? gui.boxSize.getBorderWidth() : 0;
    const borderAndPadding = padding + border;
    const borderAndPaddingX2 = borderAndPadding * 2;

    return () => {
        const elementBounds = gui.bounds.getElementBounds();
        const parentBounds = gui.bounds.getParentBounds();

        if (!parentBounds) {
            return;
        }

        elementBounds.x = parentBounds.x + borderAndPadding;
        elementBounds.y = parentBounds.y + borderAndPadding;
        elementBounds.w = parentBounds.w - borderAndPaddingX2;
        elementBounds.h = parentBounds.h - borderAndPaddingX2;
    }
}
