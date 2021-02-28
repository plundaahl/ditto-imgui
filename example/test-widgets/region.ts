import { StyledDittoContext } from '../../src/StyledDittoImGui';
import * as layout from '../layout';

export const region = {
    begin: (
        gui: StyledDittoContext,
        key: string,
    ) => {
        gui.beginElement(key);
        gui.boxSize.border = 0;

        gui.layout.addConstraints(
            layout.sizeWidthByAtLeastPx(gui, 0),
            layout.sizeHeightByAtLeastPx(gui, 0),
        );
        gui.layout.calculateLayout();
    },

    end: (gui: StyledDittoContext) => {
        gui.layout.calculateLayout();
        gui.endElement();
    },
};

export const collapsableRegion = {
    begin: (
        gui: StyledDittoContext,
        key: string,
        open: boolean,
        collapseHorizontally: boolean = false,
    ) => {
        region.begin(gui, key);

        if (!open) {
            gui.layout.addConstraints(
                collapseHorizontally
                    ? layout.sizeWidthByAtMostPx(gui, 0)
                    : layout.sizeHeightByAtMostPx(gui, 0)
            );
            gui.layout.calculateLayout();
        }
    },

    end: (gui: StyledDittoContext) => {
        region.end(gui);
    },
};
