import { StyledDittoContext } from '../../src/StyledDittoImGui';
import { StateComponentKey } from '../../src/DittoImGui';
import { bevelBox } from '../draw';
import { draggableBorder, draggableCorner, Direction } from './draggableBorder';
import { collapsableRegion } from './region'
import { miniButton } from './button';
import { titleBar } from './titleBar';
import * as layout from '../layout';

const PANEL_BORDER_WIDTH = 5;

const stateKey = new StateComponentKey('panel', {
    x: 0,
    y: 0,
    w: 300,
    h: 200,
    open: true,
});

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
            open: true,
        });
        const { x, y, w, h } = state;
        const bounds = gui.bounds.getElementBounds();
        bounds.x = x;
        bounds.y = y;
        bounds.w = w;
        bounds.h = h;
        gui.boxSize.border = PANEL_BORDER_WIDTH;
        gui.boxSize.padding = 0;

        if (gui.mouse.hoversElement() || gui.mouse.hoversChild()) {
            if (gui.mouse.isM1Down() || gui.mouse.isM2Down()) {
                gui.layer.bringLayerToFront();
            }
        }

        // Draggable Bar
        titleBar.begin(
            gui,
            key,
            (_ = state.x) => state.x += _,
            (_ = state.y) => state.y += _,
        );

        const minimizeBtnText = state.open ? '▼' : '◄';
        if (miniButton(gui, minimizeBtnText, layout.sizeWidthByPx(gui, 24))) {
            state.open = !state.open;
        }

        titleBar.end(gui);

        // Contents
        collapsableRegion.begin(gui, 'contents', state.open);
        gui.layout.addConstraints(
            layout.fillParentHorizontally(gui),
            layout.fillBelowLastSibling(gui),
        );
        gui.layout.calculateLayout();
    },

    end: (gui: StyledDittoContext) => {
        collapsableRegion.end(gui);

        const state = gui.state.getStateComponent(stateKey);
        const isOpen = state.open;
        const minimizedHieght = gui.bounds.getChildBounds().h;
        const { x, y, w, h: hBase } = gui.bounds.getElementBounds();
        const border = gui.boxSize.border;
        const borderX2 = border * 2;

        const h = isOpen
            ? hBase
            : minimizedHieght + border + border;

        const bindTop = (_ = state.y) => {
            const newEdgePos = Math.min(_, state.y + state.h - borderX2);
            state.h -= (newEdgePos - state.y);
            state.y = newEdgePos;
            return state.y;
        };
        const bindLeft = (_ = state.x) => {
            const newEdgePos = Math.min(_, state.x + state.w - borderX2);
            state.w -= (newEdgePos - state.x);
            state.x = newEdgePos;
            return state.x;
        };
        const bindBottom = (_ = state.h) => state.h = Math.max(_, borderX2);
        const bindRight = (_ = state.w) => state.w = Math.max(_, borderX2);

        if (isOpen) {
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
        }

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

        if (isOpen) {
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
        }

        const bounds = gui.bounds.getElementBounds();
        bounds.x = x;
        bounds.y = y;
        bounds.w = w;
        bounds.h = h;

        gui.draw.setFillStyle('#CCCCCC');
        gui.draw.fillRect(x, y, w, h);

        gui.draw.setStrokeStyle('#666666');
        bevelBox(gui, x, y, w, h, gui.boxSize.border, 'panel', 'idle');

        gui.endLayer();
    },
};
