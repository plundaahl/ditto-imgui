import { StyledDittoContext } from '../../src/StyledDittoImGui';

export enum Direction {
    LEFT = 'left',
    RIGHT = 'right',
    TOP = 'top',
    BOTTOM = 'bottom',
}

export function draggableBorder(
    g: StyledDittoContext,
    dir: Direction,
    bindFn: (update?: number) => number,
    x: number,
    y: number,
    w: number,
    h: number,
) {
    g.beginElement(dir);
    const bounds = g.bounds.getElementBounds();
    bounds.x = x;
    bounds.y = y;
    bounds.w = w || 1;
    bounds.h = h || 1;

    if (g.mouse.hoversElement()) {
        g.draw.setFillStyle('#00CC00');
        g.draw.fillRect(
            x,
            y,
            w,
            h,
        );

        if (g.mouse.isM1Down()) {
            const delta = (dir === Direction.TOP || dir === Direction.BOTTOM)
                ? g.mouse.getDragY()
                : g.mouse.getDragX();

            if (delta) {
                const current = bindFn();
                bindFn(current + delta);
            }
        }
    }

    g.endElement();
}

export function draggableCorner(
    g: StyledDittoContext,
    key: string,
    xBind: (update?: number) => number,
    yBind: (update?: number) => number,
    x: number,
    y: number,
    w: number,
    h: number,
) {
    g.beginElement(key);
    const bounds = g.bounds.getElementBounds();
    bounds.x = x;
    bounds.y = y;
    bounds.w = w || 1;
    bounds.h = h || 1;

    if (g.mouse.hoversElement()) {
        g.draw.setFillStyle('#00CC00');
        g.draw.fillRect(
            x,
            y,
            w,
            h,
        );

        if (g.mouse.isM1Down()) {
            const deltaX = g.mouse.getDragX();
            const deltaY = g.mouse.getDragY();

            if (deltaX) {
                xBind(xBind() + deltaX);
            }

            if (deltaY) {
                yBind(yBind() + deltaY);
            }
        }
    }

    g.endElement();
}
