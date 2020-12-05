import { StyledDittoContext } from '../StyledDittoContext';

export function createBasicVerticalLayoutFn(getGui: () => StyledDittoContext) {
    return () => {
        const gui = getGui();
        const padding = gui.boxSize.getPadding();
        const border = gui.boxSize.getBorderWidth();

        const siblingBounds = gui.bounds.getSiblingBounds();
        const elementBounds = gui.bounds.getElementBounds();
        const parentBounds = gui.bounds.getParentBounds();

        if (!parentBounds) {
            return;
        }

        if (siblingBounds.h > 0) {
            elementBounds.y = siblingBounds.y + siblingBounds.h + padding;
        } else {
            elementBounds.y = parentBounds.y + padding + border;
        }
        elementBounds.x = parentBounds.x + padding + border;
        elementBounds.w = parentBounds.w - ((padding + border) * 2);
    }
}


