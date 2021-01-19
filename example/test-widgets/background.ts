import { StyledDittoContext } from '../../src/StyledDittoImGui';

export const background = {
    begin: (g: StyledDittoContext, key: string, w: number, h: number) => {
        g.beginLayer(key);

        const bounds = g.bounds.getElementBounds();
        bounds.x = 0;
        bounds.y = 0;
        bounds.w = w;
        bounds.h = h;
    },

    end: (g: StyledDittoContext) => {
        g.endLayer();
    },
};
