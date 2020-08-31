type CustomCommandFn = { (context: CanvasRenderingContext2D, ...args: any): void };

// TODO: Continue from https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D

type ClearRectCmd = 'clearRect';
type ClearRect = [ClearRectCmd, [number, number, number, number]];
const clearRect: ClearRectCmd = 'clearRect';

type FillRectCmd = 'fillRect';
type FillRect = [FillRectCmd, [number, number, number, number]];
const fillRect: FillRectCmd = 'fillRect';

type StrokeRectCmd = 'strokeRect';
type StrokeRect = [StrokeRectCmd, [number, number, number, number]];
const strokeRect: StrokeRectCmd = 'strokeRect';

type FillTextCmd = 'fillText';
type FillText = [FillTextCmd, [string, number, number]];
const fillText: FillTextCmd = 'fillText';

type LineWidth = [CustomCommandFn, [number]];
function setLineWidth(context: CanvasRenderingContext2D, width: number): void {
    context.lineWidth = width;
}

type LineCapOpts = 'butt' | 'round' | 'square';
type LineCap = [CustomCommandFn, [LineCapOpts]];
function setLineCap(context: CanvasRenderingContext2D, cap: LineCapOpts): void {
    context.lineCap = cap;
}

type LineJoinOpts = 'bevel' | 'round' | 'miter';
type LineJoin = [CustomCommandFn, [LineJoinOpts]];
function setLineJoin(context: CanvasRenderingContext2D, cap: LineJoinOpts): void {
    context.lineJoin = cap;
}

type Font = [CustomCommandFn, [string]];
function setFont(context: CanvasRenderingContext2D, font: string): void {
    context.font = font;
}

type TextAlignOpts = 'start' | 'end' | 'left' | 'right' | 'center';
type TextAlign = [CustomCommandFn, [TextAlignOpts]];
function setTextAlign(context: CanvasRenderingContext2D, textAlign: TextAlignOpts): void {
    context.textAlign = textAlign;
}

type FillStyleOpts = string | CanvasGradient | CanvasPattern;
type FillStyle = [CustomCommandFn, [FillStyleOpts]];
function setFillStyle(context: CanvasRenderingContext2D, style: FillStyleOpts): void {
    context.fillStyle = style;
}

type StrokeStyleOpts = string | CanvasGradient | CanvasPattern;
type StrokeStyle = [CustomCommandFn, [StrokeStyleOpts]];
function setStrokeStyle(context: CanvasRenderingContext2D, style: StrokeStyleOpts): void {
    context.strokeStyle = style;
}

type BeginPathCmd = 'beginPath';
type BeginPath = [BeginPathCmd];
const beginPath: BeginPathCmd = 'beginPath';

type ClosePathCmd = 'closePath';
type ClosePath = [ClosePathCmd];
const closePath: ClosePathCmd = 'closePath';

type MoveToCmd = 'moveTo';
type MoveTo = [MoveToCmd, [number, number]];
const moveTo: MoveToCmd = 'moveTo';

type LineToCmd = 'lineTo';
type LineTo = [LineToCmd, [number, number]];
const lineTo: LineToCmd = 'lineTo';

type RectCmd = 'rect';
type Rect = [RectCmd, [number, number, number, number]];
const rect: RectCmd = 'rect';

type FillCmd = 'fill';
type Fill = [FillCmd];
const fill: FillCmd = 'fill';

type StrokeCmd = 'stroke';
type Stroke = [StrokeCmd];
const stroke: StrokeCmd = 'stroke';

type ClipCmd = 'clip';
type ClipOpts = 'nonzero' | 'evenodd';
type Clip = [ClipCmd] | [ClipCmd, [ClipOpts]];
const clip: ClipCmd = 'clip';

type SaveCmd = 'save';
type Save = [SaveCmd];
const save: SaveCmd = 'save';

type RestoreCmd = 'restore';
type Restore = [RestoreCmd];
const restore: RestoreCmd = 'restore';

type NativeCommand = ClearRect
    | FillRect
    | StrokeRect
    | FillText
    | BeginPath
    | ClosePath
    | MoveTo
    | LineTo
    | Rect
    | Fill
    | Stroke
    | Clip
    | Save
    | Restore
    ;

type CustomCommand = LineWidth
    | LineCap
    | LineJoin
    | Font
    | TextAlign
    | FillStyle
    | StrokeStyle
    ;

const utilityContext: CanvasRenderingContext2D = createContext();

const NAME = 0;
const ARGS = 1;

export class DrawContext {

    private readonly customCmds: CustomCommand[] = [];
    private readonly nativeCmds: NativeCommand[] = [];
    public x: number = 0;
    public y: number = 0;

    constructor(private readonly renderingContext: CanvasRenderingContext2D) { }

    render() {
        const { nativeCmds, customCmds, renderingContext } = this;

        for (let i = 0; i < nativeCmds.length; i++) {
            const cmd = (customCmds[i] || nativeCmds[i])[NAME];

            if (customCmds[i]) {
                const args = customCmds[i][ARGS];

                if (!args) {
                    customCmds[i][NAME](renderingContext);
                } else {
                    customCmds[i][NAME](renderingContext, ...args);
                }
            } else {
                const args = nativeCmds[i][ARGS];

                if (!args) {
                    (renderingContext[nativeCmds[i][NAME]] as any)();
                } else {
                    (renderingContext[nativeCmds[i][NAME]] as any)(...args);
                }
            }
        }

        nativeCmds.length = 0;
        customCmds.length = 0;
    }

    clearRect(x: number, y: number, w: number, h: number): void {
        this.pushNativeCommand([clearRect, [
            x + this.x,
            y + this.y,
            w,
            h,
        ]]);
    }

    fillRect(x: number, y: number, w: number, h: number): void {
        this.pushNativeCommand([fillRect, [
            x + this.x,
            y + this.y,
            w,
            h,
        ]]);
    }

    strokeRect(x: number, y: number, w: number, h: number): void {
        this.pushNativeCommand([strokeRect, [
            x + this.x,
            y + this.y,
            w,
            h,
        ]]);
    }

    drawText(text: string, x: number, y: number) {
        const { height } = this.measureText(fillText);
        this.pushNativeCommand([fillText, [
            text,
            x + this.x,
            y + this.y + height,
        ]]);
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
        this.pushCustomCommand([setLineWidth, [width]])
    }

    setLineCap(cap: LineCapOpts): void {
        this.pushCustomCommand([setLineCap, [cap]]);
    }

    setLineJoin(join: LineJoinOpts): void {
        this.pushCustomCommand([setLineJoin, [join]]);
    }

    setFont(font: string): void {
        this.pushCustomCommand([setFont, [font]]);
    }

    setFillStyle(style: FillStyleOpts): void {
        this.pushCustomCommand([setFillStyle, [style]]);
    }

    setStrokeStyle(style: StrokeStyleOpts): void {
        this.pushCustomCommand([setStrokeStyle, [style]]);
    }

    setTextAlign(align: TextAlignOpts): void {
        this.pushCustomCommand([setTextAlign, [align]]);
    }

    beginPath(): void {
        this.pushNativeCommand([beginPath]);
    }

    closePath(): void {
        this.pushNativeCommand([closePath]);
    }

    moveTo(x: number, y: number): void {
        this.pushNativeCommand([moveTo, [
            x + this.x,
            y + this.y,
        ]]);
    }

    lineTo(x: number, y: number): void {
        this.pushNativeCommand([lineTo, [
            x + this.x,
            y + this.y,
        ]]);
    }

    fill(): void {
        this.pushNativeCommand([fill]);
    }

    stroke(): void {
        this.pushNativeCommand([stroke]);
    }

    clip(fillRule?: ClipOpts): void {
        if (fillRule) {
            this.pushNativeCommand([clip, [fillRule]]);
        } else {
            this.pushNativeCommand([clip]);
        }
    }

    rect(x: number, y: number, w: number, h: number): void {
        this.pushNativeCommand([rect, [
            x + this.x,
            y + this.y,
            w,
            h,
        ]]);
    }

    save(): void {
        this.pushNativeCommand([save]);
    }

    restore(): void {
        this.pushNativeCommand([restore]);
    }

    private pushNativeCommand(cmd: NativeCommand) {
        this.customCmds.length++;
        this.nativeCmds.push(cmd);
    }

    private pushCustomCommand(cmd: CustomCommand) {
        this.nativeCmds.length++;
        this.customCmds.push(cmd);
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
