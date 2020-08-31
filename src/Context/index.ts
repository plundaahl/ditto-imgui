import { MouseContext, IMouseContext } from './MouseContext';
import { CurElementContext, ICurElementContext } from './CurElementContext';
import { DrawContext } from './DrawContext';
import { ChildrenContext, IChildrenContext } from './ChildrenContext';

export class Context {

    private activeElements: number = 0;
    private readonly renderingContext: CanvasRenderingContext2D;
    private readonly mouseContext: MouseContext;
    private readonly curElementContext: CurElementContext;
    private readonly childrenContext: ChildrenContext;
    private readonly drawContext: DrawContext;

    constructor(canvas: HTMLCanvasElement) {
        const canvasContext = canvas.getContext('2d');
        if (!canvasContext) {
            throw new Error('Could not get context');
        }
        this.renderingContext = canvasContext;

        this.childrenContext = new ChildrenContext();
        this.mouseContext = new MouseContext(canvas, this.childrenContext);
        this.curElementContext = new CurElementContext(this.mouseContext);
        this.drawContext = new DrawContext(this.childrenContext, this.renderingContext);
    }

    get mouse(): IMouseContext { return this.mouseContext; }
    get curElement(): ICurElementContext { return this.curElementContext; }
    get draw(): DrawContext { return this.drawContext; }
    get children(): IChildrenContext { return this.childrenContext; }

    render(): void {
        if (this.activeElements !== 0) {
            throw new Error('Mismatched calls to #beginElement and #endElement');
        }

        this.mouseContext.update();
        this.curElementContext.onPostRender();
        this.drawContext.render();
    }

    beginElement(x: number, y: number, w: number, h: number) {
        this.activeElements++;
        this.childrenContext.pushElement();
        this.mouseContext.pushElement(x, y, w, h);
        this.curElementContext.pushElement();
        this.draw.save();
        this.draw.translate(x, y);
    }

    endElement() {
        this.activeElements--;
        this.mouseContext.popElement();
        this.curElementContext.popElement();
        this.draw.restore();
        this.childrenContext.popElement();
    }
}
