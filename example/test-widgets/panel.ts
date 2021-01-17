import { StyledDittoContext } from '../../src/StyledDittoImGui';
import { StateComponentKey } from '../../src/DittoImGui';
import { drawBorderBox } from './drawUtils';
import { draggableBorder, draggableCorner, Direction } from './draggableBorder';
import { container } from './container'
import * as layout from '../layout';

const PANEL_BORDER_WIDTH = 5;

const stateKey = new StateComponentKey('panel', { x: 0, y: 0, w: 300, h: 200 });

export const panel = {
    begin: (
        gui: StyledDittoContext,
        key: string,
        xInit: number,
        yInit: number,
        wInit: number,
        hInit: number,
    ) => {
        gui.beginLayer(key);
        const state = gui.state.getStateComponent(stateKey, {
            x: xInit,
            y: yInit,
            w: wInit,
            h: hInit,
        });
        const { x, y, w, h } = state;
        const bounds = gui.bounds.getElementBounds();
        bounds.x = x;
        bounds.y = y;
        bounds.w = w;
        bounds.h = h;

        gui.boxSize.border = PANEL_BORDER_WIDTH;
        gui.boxSize.padding = 0;

        // Draggable Bar
        {
            container.begin(gui, 'titlebar', '#FF0000',
                layout.widthFillsParent(gui),
                layout.belowLastSibling(gui),
                layout.heightExactly(gui, 30),
            );
            gui.boxSize.border = 0;

            if (gui.mouse.hoversElement()) {
                const { x, y, w, h } = gui.bounds.getElementBounds();
                gui.draw.setFillStyle('#00CC00');
                gui.draw.fillRect(x, y, w, h);

                if (gui.mouse.isM1Down()) {
                    state.x += gui.mouse.getDragX();
                    bounds.x = state.x;
                    state.y += gui.mouse.getDragY();
                    bounds.y = state.y;
                }
            } else {
                gui.draw.setFillStyle('#5555FF');
                gui.draw.fillRect(x, y, w, h);
            }

            container.end(gui);
        }

        // Contents
        container.begin(gui, 'contents', '#FF0000',
            layout.widthFillsParent(gui),
            layout.fillBelowLastSibling(gui),
        );
        gui.boxSize.border = 0;
    },

    end: (gui: StyledDittoContext) => {
        container.end(gui);

        const state = gui.state.getStateComponent(stateKey);
        const { x, y, w, h } = state;
        const border = gui.boxSize.border;

        const bindTop = (_ = state.y) => {
            state.h -= (_ - state.y);
            state.y = _;
            return state.y;
        };
        const bindLeft = (_ = state.x) => {
            state.w -= (_ - state.x);
            state.x = _;
            return state.x;
        };
        const bindBottom = (_ = state.h) => state.h = _;
        const bindRight = (_ = state.w) => state.w = _;

        draggableBorder(
            gui,
            Direction.TOP,
            bindTop,
            x + border,
            y,
            w - (border * 2),
            border,
        );

        draggableBorder(
            gui,
            Direction.BOTTOM,
            bindBottom,
            x + border,
            y + h - border,
            w - (border * 2),
            border,
        );

        draggableBorder(
            gui,
            Direction.LEFT,
            bindLeft,
            x,
            y + border,
            border,
            h - (border * 2),
        );

        draggableBorder(
            gui,
            Direction.RIGHT,
            bindRight,
            x + w - border,
            y + border,
            border,
            h - (border * 2),
        );

        draggableCorner(gui, 'topleft', bindLeft, bindTop,
            x,
            y,
            border,
            border,
        );

        draggableCorner(gui, 'topRight', bindRight, bindTop,
            x + w - border,
            y,
            border,
            border,
        );

        draggableCorner(gui, 'bottomRight', bindRight, bindBottom,
            x + w - border,
            y + h - border,
            border,
            border,
        );

        draggableCorner(gui, 'bottomLeft', bindLeft, bindBottom,
            x,
            y + h - border,
            border,
            border,
        );

        const bounds = gui.bounds.getElementBounds();
        bounds.x = x;
        bounds.y = y;
        bounds.w = w;
        bounds.h = h;

        gui.draw.setFillStyle('#CCCCCC');
        gui.draw.fillRect(x, y, w, h);

        gui.draw.setStrokeStyle('#666666');
        drawBorderBox(gui, x, y, w, h, gui.boxSize.border);

        gui.endLayer();
    },
};
