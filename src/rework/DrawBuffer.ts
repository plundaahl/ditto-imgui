import { DrawCommand } from './DrawCommand';
import {
    setLineWidth,
    LineCapOpts,
    setLineCap,
    LineJoinOpts,
    setLineJoin,
    setFont,
    FillStyleOpts,
    StrokeStyleOpts,
    setFillStyle,
    setStrokeStyle,
    TextAlignOpts,
    setTextAlign,
} from './CustomDrawCommands';

export interface DrawContext {
    clearRect(x: number, y: number, w: number, h: number): void;
    fillRect(x: number, y: number, w: number, h: number): void;
    strokeRect(x: number, y: number, w: number, h: number): void;
    drawText(text: string, x: number, y: number): void;
    measureText(text: string): { width: number, height: number };
    setLineWidth(width: number): void;
    setLineCap(cap: LineCapOpts): void;
    setLineJoin(join: LineJoinOpts): void;
    setFont(font: string): void;
    setFillStyle(style: FillStyleOpts): void;
    setStrokeStyle(style: StrokeStyleOpts): void;
    setTextAlign(align: TextAlignOpts): void;
    beginPath(): void;
    closePath(): void;
    moveTo(x: number, y: number): void;
    lineTo(x: number, y: number): void;
    fill(): void;
    stroke(): void;
    clip(fillRule?: 'nonzero' | 'evenodd'): void;
    rect(x: number, y: number, w: number, h: number): void;
    save(): void;
    restore(): void;
    translate(x: number, y: number): void;
}

export class DrawBuffer implements DrawContext {

    private readonly buffer: DrawCommand[] = [];
    private readonly utilityContext: CanvasRenderingContext2D;

    constructor(
        createCanvasContext: () => CanvasRenderingContext2D, 
    ) {
        this.utilityContext = createCanvasContext();
    }

    render(context: CanvasRenderingContext2D) {
        const { buffer } = this;

        for (let cmd of buffer) {
            if (cmd.native) {
                (context[cmd.command] as any)(...cmd.args);
            } else {
                cmd.command(context, ...cmd.args);
            }
        }
    }

    clear() {
        this.buffer.length = 0;
    }

    clearRect(x: number, y: number, w: number, h: number): void {
        this.pushDrawCommand({
            command: 'clearRect',
            native: true,
            args: [
                x,
                y,
                w,
                h,
            ]
        });
    }

    fillRect(x: number, y: number, w: number, h: number): void {
        this.pushDrawCommand({
            command: 'fillRect',
            native: true,
            args: [
                x,
                y,
                w,
                h,
            ]
        });
    }

    strokeRect(x: number, y: number, w: number, h: number): void {
        this.pushDrawCommand({
            command: 'strokeRect',
            native: true,
            args: [
                x,
                y,
                w,
                h,
            ]
        });
    }

    drawText(text: string, x: number, y: number) {
        const { height } = this.measureText('fillText');
        this.pushDrawCommand({
            command: 'fillText',
            native: true,
            args: [
                text,
                x,
                y + height,
            ]
        })
    }

    measureText(text: string) {
        const actualTextMetrics = this.utilityContext.measureText(text);
        const width = actualTextMetrics.actualBoundingBoxLeft + actualTextMetrics.actualBoundingBoxRight;
        const approxHeight = this.utilityContext.measureText('M').width;
        return {
            width,
            height: approxHeight,
        };
    }

    setLineWidth(width: number): void {
        this.utilityContext.lineWidth = width;
        this.pushDrawCommand({
            native: false,
            command: setLineWidth,
            args: [width],
        });
    }

    setLineCap(cap: LineCapOpts): void {
        this.pushDrawCommand({
            native: false,
            command: setLineCap,
            args: [cap],
        })
    }

    setLineJoin(join: LineJoinOpts): void {
        this.pushDrawCommand({
            native: false,
            command: setLineJoin,
            args: [join],
        });
    }

    setFont(font: string): void {
        this.pushDrawCommand({
            native: false,
            command: setFont,
            args: [font],
        });
    }

    setFillStyle(style: FillStyleOpts): void {
        this.pushDrawCommand({
            native: false,
            command: setFillStyle,
            args: [style],
        });
    }

    setStrokeStyle(style: StrokeStyleOpts): void {
        this.pushDrawCommand({
            native: false,
            command: setStrokeStyle,
            args: [style],
        });
    }

    setTextAlign(align: TextAlignOpts): void {
        this.pushDrawCommand({
            native: false,
            command: setTextAlign,
            args: [align],
        });
    }

    beginPath(): void {
        this.pushDrawCommand({
            native: true,
            command: 'beginPath',
            args: []
        });
    }

    closePath(): void {
        this.pushDrawCommand({
            native: true,
            command: 'closePath',
            args: [],
        });
    }

    moveTo(x: number, y: number): void {
        this.pushDrawCommand({
            native: true,
            command: 'moveTo',
            args: [
                x,
                y,
            ]
        });
    }

    lineTo(x: number, y: number): void {
        this.pushDrawCommand({
            native: true,
            command: 'lineTo',
            args: [
                x,
                y,
            ]
        });
    }

    fill(): void {
        this.pushDrawCommand({
            native: true,
            command: 'fill',
            args: []
        });
    }

    stroke(): void {
        this.pushDrawCommand({
            native: true,
            command: 'stroke',
            args: []
        });
    }

    clip(fillRule?: 'nonzero' | 'evenodd'): void {
        if (fillRule) {
            this.pushDrawCommand({
                native: true,
                command: 'clip',
                args: [fillRule]
            });
        } else {
            this.pushDrawCommand({
                native: true,
                command: 'clip',
                args: []
            });
        }
    }

    rect(x: number, y: number, w: number, h: number): void {
        this.pushDrawCommand({
            native: true,
            command: 'rect',
            args: [
                x,
                y,
                w,
                h,
            ]
        });
    }

    save(): void {
        this.pushDrawCommand({
            native: true,
            command: 'save',
            args: [],
        });
    }

    restore(): void {
        this.pushDrawCommand({
            native: true,
            command: 'restore',
            args: [],
        });
    }

    translate(x: number, y: number): void {
        this.pushDrawCommand({
            native: true,
            command: 'translate',
            args: [x, y],
        });
    }

    private pushDrawCommand(command: DrawCommand) {
        this.buffer.push(command);
    }
}

export function createCanvasContext() {
    const canvas = document.createElement('canvas');
    if (!canvas) {
        throw new Error('Could not create canvas');
    }

    const context = canvas.getContext('2d');
    if (!context) {
        throw new Error('Could not get context');
    }

    return context;
}
