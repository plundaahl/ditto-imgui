import { StyledDittoContext } from '../../src/StyledDittoImGui';
import { borderBox } from '../draw/box';
import * as layout from '../layout';

type DrawBoxFn = { (
    gui: StyledDittoContext,
    x: number,
    y: number,
    w: number,
    h: number,
    border: number,
): void; };

const drawBoxFns: (DrawBoxFn | undefined)[] = [];

const drawDefaultBox: DrawBoxFn = (g, x, y, w, h, border) => borderBox(
    g,
    x,
    y,
    w,
    h,
    border,
    'panel',
    'idle',
);

export const container = {
    begin: (
        gui: StyledDittoContext,
        key: string,
        border: number = 2,
        drawBox: DrawBoxFn | undefined = drawDefaultBox,
    ) => {
        gui.beginElement(key);
        gui.boxSize.border = border;
        const borderX2 = border * 2;
        drawBoxFns.push(drawBox);

        gui.layout.addConstraints(
            layout.sizeWidthByAtLeastPx(gui, borderX2),
            layout.sizeHeightByAtLeastPx(gui, borderX2),
        );
        gui.layout.calculateLayout();
    },

    end: (gui: StyledDittoContext) => {
        gui.layout.calculateLayout();

        const drawBox = drawBoxFns.pop();
        if (drawBox) {
            const { x, y, w, h } = gui.bounds.getElementBounds();
            borderBox(gui, x, y, w, h, gui.boxSize.border, 'panel', 'idle');
        }

        gui.endElement();
    },
};

export const verticallyCollapsableContainer = {
    begin: (
        gui: StyledDittoContext,
        key: string,
        open: boolean,
        border: number = 2,
        drawBox: DrawBoxFn | undefined = drawDefaultBox,
    ) => {
        container.begin(gui, key, border, drawBox);

        if (!open) {
            gui.layout.addConstraints(
                layout.sizeHeightByAtMostPx(
                    gui, gui.boxSize.border * 2));
            gui.layout.calculateLayout();
        }
    },

    end: (gui: StyledDittoContext) => {
        container.end(gui);
    },
};

export const horizontallyCollapsableContainer = {
    begin: (
        gui: StyledDittoContext,
        key: string,
        open: boolean,
        border: number = 2,
        drawBox: DrawBoxFn | undefined = drawDefaultBox,
    ) => {
        container.begin(gui, key, border, drawBox);

        if (!open) {
            gui.layout.addConstraints(
                layout.sizeWidthByAtMostPx(
                    gui, gui.boxSize.border * 2));
            gui.layout.calculateLayout();
        }
    },

    end: (gui: StyledDittoContext) => {
        container.end(gui);
    },
};
