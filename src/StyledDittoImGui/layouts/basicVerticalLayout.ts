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

        elementBounds.y = siblingBounds.y + siblingBounds.h + padding;
        elementBounds.x = parentBounds.x + padding + border;
        elementBounds.w = parentBounds.w - ((padding + border) * 2);
    }
}


