import { StyledDittoContext } from '../../src/StyledDittoImGui';

export const panel = {
    begin: (gui: StyledDittoContext, key: string, ...constraints: {(): void}[]) => {
        gui.beginLayer(key);
        gui.layout.addConstraints(...constraints);
        gui.layout.calculateLayout();
    },

    end: (gui: StyledDittoContext) => {
        gui.layout.calculateLayout();
        const { x, y, w, h } = gui.bounds.getElementBounds();

        gui.draw.setFillStyle('#CCCCCC');
        gui.draw.setStrokeStyle('#FF0000');
        gui.draw.fillRect(x, y, w, h);
        gui.draw.strokeRect(x, y, w, h);

        gui.endLayer();
    },
};
