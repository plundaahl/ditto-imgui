import { StyledDittoContext } from '../../src/StyledDittoImGui';
import { drawBorderBox } from './drawUtils';

const colors: string[] = [];

export const container = {
    begin: (
        gui: StyledDittoContext,
        key: string,
        color: string = '#FF0000',
        ...constraints: {(): void}[]
    ) => {
        colors.push(color);
        gui.beginElement(key);

        gui.layout.addConstraints(...constraints);
        gui.layout.calculateLayout();
    },

    end: (gui: StyledDittoContext) => {
        gui.layout.calculateLayout();
        const { x, y, w, h } = gui.bounds.getElementBounds();

        gui.draw.setStrokeStyle(colors.pop() || '#FF0000');
        drawBorderBox(gui, x, y, w, h, gui.boxSize.border);
        gui.endElement();
    },
};
