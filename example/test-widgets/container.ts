import { StyledDittoContext } from '../../src/StyledDittoImGui';
import { borderBox } from '../draw/box';
import * as layout from '../layout';

export const container = {
    begin: (
        gui: StyledDittoContext,
        key: string,
        ...constraints: {(): void}[]
    ) => {
        gui.beginElement(key);
        gui.boxSize.border = 2;

        gui.layout.addConstraints(
            layout.sizeWidthByAtLeastPx(gui, 0),
            layout.sizeHeightByAtLeastPx(gui, 0),
            ...constraints,
        );
        gui.layout.calculateLayout();
    },

    end: (gui: StyledDittoContext) => {
        gui.layout.calculateLayout();

        const { x, y, w, h } = gui.bounds.getElementBounds();
        borderBox(gui, x, y, w, h, gui.boxSize.border, 'panel', 'idle');

        gui.endElement();
    },
};
