import { IChildrenContext } from "./ChildrenContext";

type CustomCommandFn = { (context: CanvasRenderingContext2D, ...args: any): void };
type CanvasRenderingContext2DFunctions = Pick<CanvasRenderingContext2D,
    'clearRect' | 'fillRect' | 'strokeRect' | 'fillText' | 'strokeText' |
    'measureText' | 'getLineDash' | 'setLineDash' | 'createLinearGradient' |
    'createRadialGradient' | 'createPattern' | 'beginPath' | 'closePath' |
    'moveTo' | 'lineTo' | 'bezierCurveTo' | 'quadraticCurveTo' | 'arc' |
    'arcTo' | 'ellipse' | 'rect' | 'fill' | 'stroke' | 'drawFocusIfNeeded' |
    'scrollPathIntoView' | 'clip' | 'isPointInPath' | 'isPointInStroke' |
    'rotate' | 'scale' | 'translate' | 'transform' | 'setTransform' |
    'resetTransform' | 'drawImage' | 'createImageData' | 'getImageData' |
    'putImageData' | 'save' | 'restore'
>

interface INativeCommandCore<T extends keyof CanvasRenderingContext2DFunctions> {
    native: true,
    command: T,
    args: Parameters<CanvasRenderingContext2DFunctions[T]>
}
interface INativeCommand extends INativeCommandCore<keyof CanvasRenderingContext2DFunctions> { }

interface ICustomCommand<T extends (...args: any) => void> {
    native: false,
    command: T,
    args: Parameters<T>,
}

function setLineWidth(context: CanvasRenderingContext2D, width: number): void {
    context.lineWidth = width;
}

type LineCapOpts = 'butt' | 'round' | 'square';
function setLineCap(context: CanvasRenderingContext2D, cap: LineCapOpts): void {
    context.lineCap = cap;
}

type LineJoinOpts = 'bevel' | 'round' | 'miter';
function setLineJoin(context: CanvasRenderingContext2D, cap: LineJoinOpts): void {
    context.lineJoin = cap;
}

function setFont(context: CanvasRenderingContext2D, font: string): void {
    context.font = font;
}

type TextAlignOpts = 'start' | 'end' | 'left' | 'right' | 'center';
function setTextAlign(context: CanvasRenderingContext2D, textAlign: TextAlignOpts): void {
    context.textAlign = textAlign;
}

type FillStyleOpts = string | CanvasGradient | CanvasPattern;
function setFillStyle(context: CanvasRenderingContext2D, style: FillStyleOpts): void {
    context.fillStyle = style;
}

type StrokeStyleOpts = string | CanvasGradient | CanvasPattern;
function setStrokeStyle(context: CanvasRenderingContext2D, style: StrokeStyleOpts): void {
    context.strokeStyle = style;
}
const utilityContext: CanvasRenderingContext2D = createContext();

export class DrawContext {

    private readonly commands: (ICustomCommand<any> | INativeCommand)[] = [];
    public x: number = 0;
    public y: number = 0;

    constructor(
        private readonly childrenContext: IChildrenContext,
        private readonly renderingContext: CanvasRenderingContext2D,
    ) { }

    render() {
        const { renderingContext, commands } = this;

        for (let cmd of commands) {
            if (cmd.native) {
                (renderingContext[cmd.command] as any)(...cmd.args);
            } else {
                cmd.command(renderingContext, ...cmd.args);
            }
        }
        commands.length = 0;
    }

    clearRect(x: number, y: number, w: number, h: number): void {
        this.commands.push({
            command: 'clearRect',
            native: true,
            args: [
                x + this.x,
                y + this.y,
                w,
                h,
            ]
        });
    }

    fillRect(x: number, y: number, w: number, h: number): void {
        this.commands.push({
            command: 'fillRect',
            native: true,
            args: [
                x + this.x,
                y + this.y,
                w,
                h,
            ]
        });
    }

    strokeRect(x: number, y: number, w: number, h: number): void {
        this.commands.push({
            command: 'strokeRect',
            native: true,
            args: [
                x + this.x,
                y + this.y,
                w,
                h,
            ]
        });
    }

    drawText(text: string, x: number, y: number) {
        const { height } = this.measureText('fillText');
        this.commands.push({
            command: 'fillText',
            native: true,
            args: [
                text,
                x + this.x,
                y + this.y + height,
            ]
        })
    }

    measureText(text: string) {
        const actualTextMetrics = utilityContext.measureText(text);
        const width = actualTextMetrics.actualBoundingBoxLeft + actualTextMetrics.actualBoundingBoxRight;
        const approxHeight = utilityContext.measureText('M').width;
        return {
            width,
            height: approxHeight,
        };
    }

    setLineWidth(width: number): void {
        utilityContext.lineWidth = width;
        this.commands.push({
            native: false,
            command: setLineWidth,
            args: [width],
        });
    }

    setLineCap(cap: LineCapOpts): void {
        this.commands.push({
            native: false,
            command: setLineCap,
            args: [cap],
        })
    }

    setLineJoin(join: LineJoinOpts): void {
        this.commands.push({
            native: false,
            command: setLineJoin,
            args: [join],
        });
    }

    setFont(font: string): void {
        this.commands.push({
            native: false,
            command: setFont,
            args: [font],
        });
    }

    setFillStyle(style: FillStyleOpts): void {
        this.commands.push({
            native: false,
            command: setFillStyle,
            args: [style],
        });
    }

    setStrokeStyle(style: StrokeStyleOpts): void {
        this.commands.push({
            native: false,
            command: setStrokeStyle,
            args: [style],
        });
    }

    setTextAlign(align: TextAlignOpts): void {
        this.commands.push({
            native: false,
            command: setTextAlign,
            args: [align],
        });
    }

    beginPath(): void {
        this.commands.push({
            native: true,
            command: 'beginPath',
            args: []
        });
    }

    closePath(): void {
        this.commands.push({
            native: true,
            command: 'closePath',
            args: [],
        });
    }

    moveTo(x: number, y: number): void {
        this.commands.push({
            native: true,
            command: 'moveTo',
            args: [
                x + this.x,
                y + this.y,
            ]
        });
    }

    lineTo(x: number, y: number): void {
        this.commands.push({
            native: true,
            command: 'lineTo',
            args: [
                x + this.x,
                y + this.y,
            ]
        });
    }

    fill(): void {
        this.commands.push({
            native: true,
            command: 'fill',
            args: []
        });
    }

    stroke(): void {
        this.commands.push({
            native: true,
            command: 'stroke',
            args: []
        });
    }

    clip(fillRule?: 'nonzero' | 'evenodd'): void {
        if (fillRule) {
            this.commands.push({
                native: true,
                command: 'clip',
                args: [fillRule]
            });
        } else {
            this.commands.push({
                native: true,
                command: 'clip',
                args: []
            });
        }
    }

    rect(x: number, y: number, w: number, h: number): void {
        this.commands.push({
            native: true,
            command: 'rect',
            args: [
                x + this.x,
                y + this.y,
                w,
                h,
            ]
        });
    }

    save(): void {
        this.commands.push({
            native: true,
            command: 'save',
            args: [],
        });
    }

    restore(): void {
        this.commands.push({
            native: true,
            command: 'restore',
            args: [],
        });
    }

    translate(x: number, y: number): void {
        this.commands.push({
            native: true,
            command: 'translate',
            args: [x, y],
        });
    }
}

function createContext() {
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
