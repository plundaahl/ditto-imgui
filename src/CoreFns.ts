import { Context } from './Context';

export function drawFrame(
    context: Context,
    x: number,
    y: number,
    w: number,
    h: number,
): void {
    context.draw.strokeRect(x, y, w, h);
}

export function button(
    context: Context,
    text: string,
    x: number = 0,
    y: number = 0,
): boolean {
    const padding: number = 4;
    const { width, height } = context.draw.measureText(text);

    const w = width + (padding * 2);
    const h = height + (padding * 2);

    context.declareElement(x, y, w, h);

    context.draw.setFillStyle(
        context.curElement.isActive()
            ? '#ff5555'
            : context.curElement.isHot()
                ? '#8888FF'
                : '#bbbbbb');
    context.draw.fillRect(
        x,
        y,
        w,
        h,
    );

    context.draw.setFillStyle('#000000');
    context.draw.drawText(
        text,
        x + padding,
        y + padding,
    );

    return context.curElement.isTriggered();
}
