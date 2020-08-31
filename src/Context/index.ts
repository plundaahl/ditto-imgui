import { MouseContext, IMouseContext } from './MouseContext';
import { CurElementContext, ICurElementContext } from './CurElementContext';
import { DrawContext } from './DrawContext';

export class Context {

    private readonly renderingContext: CanvasRenderingContext2D;
    private readonly mouseContext: MouseContext;
    private readonly curElementContext: CurElementContext;
    private readonly drawContext: DrawContext;

    constructor(canvas: HTMLCanvasElement) {
        const canvasContext = canvas.getContext('2d');
        if (!canvasContext) {
            throw new Error('Could not get context');
        }
        this.renderingContext = canvasContext;

        this.mouseContext = new MouseContext(canvas);
        this.curElementContext = new CurElementContext(this.mouseContext);
        this.drawContext = new DrawContext(this.renderingContext);
    }

    get mouse(): IMouseContext { return this.mouseContext; }
    get curElement(): ICurElementContext { return this.curElementContext; }
    get draw(): DrawContext { return this.drawContext; }

    render(): void {
        this.mouseContext.update();
        this.curElementContext.onPostRender();
        this.drawContext.render();
    }

    beginElement(x: number, y: number, w: number, h: number) {
        this.mouseContext.pushElement(x, y, w, h);
        this.curElementContext.pushElement();
        this.draw.save();
        this.draw.translate(x, y);
    }

    endElement() {
        this.mouseContext.popElement();
        this.curElementContext.popElement();
        this.draw.restore();
    }
}
