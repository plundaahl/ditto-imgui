import { DrawContext } from './Context';

export function drawFrame(
    context: DrawContext,
    x: number,
    y: number,
    w: number,
    h: number,
): void {
    context.strokeRect(x, y, w, h);
}

export function button(
    context: DrawContext,
    text: string,
    x: number = 0,
    y: number = 0,
): boolean {
    const padding: number = 4;
    const { width, height } = context.measureText(text);

    const w = width + (padding * 2);
    const h = height + (padding * 2);

    context.setCurElementBounds(x, y, w, h);

    context.setFillStyle(
        context.isCurElementActive()
            ? '#ff5555'
            : context.mouse.isCurElementHovered()
                ? '#8888FF'
                : '#bbbbbb');
    context.fillRect(
        x,
        y,
        w,
        h,
    );

    context.setFillStyle('#000000');
    context.drawText(
        text,
        x + padding,
        y + padding,
    );

    return context.mouse.isCurElementClicked();
}
