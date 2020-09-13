import { DrawCommand } from './DrawCommand';

export function setLineWidth(context: CanvasRenderingContext2D, width: number): void {
    context.lineWidth = width;
}

export type LineCapOpts = 'butt' | 'round' | 'square';
export function setLineCap(context: CanvasRenderingContext2D, cap: LineCapOpts): void {
    context.lineCap = cap;
}

export type LineJoinOpts = 'bevel' | 'round' | 'miter';
export function setLineJoin(context: CanvasRenderingContext2D, cap: LineJoinOpts): void {
    context.lineJoin = cap;
}

export function setFont(context: CanvasRenderingContext2D, font: string): void {
    context.font = font;
}

export type TextAlignOpts = 'start' | 'end' | 'left' | 'right' | 'center';
export function setTextAlign(context: CanvasRenderingContext2D, textAlign: TextAlignOpts): void {
    context.textAlign = textAlign;
}

export type FillStyleOpts = string | CanvasGradient | CanvasPattern;
export function setFillStyle(context: CanvasRenderingContext2D, style: FillStyleOpts): void {
    context.fillStyle = style;
}

export type StrokeStyleOpts = string | CanvasGradient | CanvasPattern;
export function setStrokeStyle(context: CanvasRenderingContext2D, style: StrokeStyleOpts): void {
    context.strokeStyle = style;
}
