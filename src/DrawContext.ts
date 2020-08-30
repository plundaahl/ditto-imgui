
const CLEAR_RECT = 'clearRect';
const FILL_TEXT = 'fillText';
type CanvasCommand = 'clearRect' | 'strokeRect' | 'fillText';

export class DrawContext {

    private readonly cmds: CanvasCommand[] = [];
    private readonly args: any[][] = [];

    render(context: CanvasRenderingContext2D) {
        const { cmds, args } = this;

        for (let i = 0; i < cmds.length; i++) {
            (context[cmds[i]] as any)(...args[i]);
        }

        cmds.length = 0;
        args.length = 0;
    }

    clearRect(x: number, y: number, w: number, h: number): void {
        this.cmds.push(CLEAR_RECT);
        this.args.push([x, y, w, h]);
    }

    drawText(text: string, x: number, y: number) {
        this.cmds.push(FILL_TEXT);
        this.args.push([text, x, y]);
    }
}
