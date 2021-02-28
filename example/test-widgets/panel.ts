import { StyledDittoContext } from '../../src/StyledDittoImGui';
import { StateComponentKey } from '../../src/DittoImGui';
import { bevelBox } from '../draw';
import { draggableBorder, draggableCorner, Direction } from './draggableBorder';
import { container, verticallyCollapsableContainer } from './container'
import { miniButton } from './button';
import { TextPainter } from './TextPainter';
import * as layout from '../layout';

const PANEL_BORDER_WIDTH = 5;
const PADDING = 2;
const fontStyle = '16px monospace';

const stateKey = new StateComponentKey('panel', {
    x: 0,
    y: 0,
    w: 300,
    h: 200,
    open: true,
    minimizedHieght: 0,
});

const textPainterMap = new Map<StyledDittoContext, TextPainter>();
function getTextPainter(g: StyledDittoContext): TextPainter {
    const painter = textPainterMap.get(g) || new TextPainter(g);
    textPainterMap.set(g, painter);
    return painter;
}

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
            minimizedHieght: 0,
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
        {
            container.begin(gui, 'titlebar', 0);
            gui.layout.addConstraints(
                layout.fillParentHorizontally(gui),
                layout.offsetPosFromSiblingBottom(gui),
                layout.sizeHeightByPx(gui, 30),
            );
            gui.layout.addChildConstraints(
                layout.fillParentVertically(gui),
                layout.offsetRightFromParentRight(gui),
            );
            gui.layout.calculateLayout();
            gui.boxSize.border = 0;
            gui.boxSize.padding = PADDING;
            const { x, y, w, h } = gui.bounds.getElementBounds();

            if (gui.mouse.hoversElement()) {
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

            // title
            {
                gui.draw.setFont(fontStyle);
                const metric = gui.draw.measureText(key);
                const textYOffset = (h - metric.ascent - metric.descent) * 0.5 - PADDING;
                getTextPainter(gui)
                    .startBuilder(key, x + textYOffset, y + textYOffset, '#FFFFFF')
                    .build()
                    .paint();
            }

            // button
            gui.layout.calculateLayout();
            state.minimizedHieght = gui.bounds.getElementBounds().h;
            const minimizeButtonText = state.open ? '▼' : '◄';
            if (miniButton(
                gui,
                minimizeButtonText,
                layout.offsetLeftFromSiblingLeftByPx(gui, -18)
            )) {
                state.open = !state.open;
            }
            container.end(gui);
        }

        // Contents
        verticallyCollapsableContainer.begin(gui, 'contents', state.open, 0, undefined);
        gui.layout.addConstraints(
            layout.fillParentHorizontally(gui),
            layout.fillBelowLastSibling(gui),
        );
        gui.layout.calculateLayout();
    },

    end: (gui: StyledDittoContext) => {
        verticallyCollapsableContainer.end(gui);

        const state = gui.state.getStateComponent(stateKey);
        const isOpen = state.open;
        const minimizedHieght = gui.bounds.getChildBounds().h;
        const { x, y, w, h: hBase } = state;
        const border = gui.boxSize.border;

        const h = isOpen
            ? hBase
            : minimizedHieght + border + border;

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
