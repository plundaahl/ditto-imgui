import { DrawContext } from './DrawContext';

export function drawFrame(
    context: DrawContext,
    x: number,
    y: number,
    w: number,
    h: number,
): void {
    context.strokeRect(x, y, w, h);
}
