import { DrawCommand, UiElement } from '../../types';
import { DrawHandler } from './DrawHandler';
import { createOffscreenCanvasContext } from './createOffscreenCanvasContext';
import {
    setLineWidth,
    setLineCap,
    LineCapOpts,
    setLineJoin,
    LineJoinOpts,
    setFont,
    setTextAlign,
    TextAlignOpts,
    setFillStyle,
    FillStyleOpts,
    setStrokeStyle,
    StrokeStyleOpts,
} from './CustomCommands';

export class DrawHandlerImpl implements DrawHandler {
    private readonly utilityContext: CanvasRenderingContext2D;
    private currentElement?: UiElement;

    constructor(
        createCanvasContext: () => CanvasRenderingContext2D = createOffscreenCanvasContext,
    ) {
        this.utilityContext = createCanvasContext();
        this.setCurrentElement = this.setCurrentElement.bind(this);
    }

    setCurrentElement(element: UiElement | undefined) {
        this.currentElement = element;
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

    protected pushDrawCommand(command: DrawCommand) {
        const element = this.currentElement;
        if (!element) {
            throw new Error('no element present');
        }
        element.drawBuffer.push(command);
    }
}

