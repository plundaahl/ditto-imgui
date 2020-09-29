import { Layer, UiElement } from '../../types';
import { Renderer } from './Renderer';

export class RendererImpl implements Renderer {
    constructor(
        private readonly context: CanvasRenderingContext2D,
    ) {
        this.render = this.render.bind(this);
        this.renderElement = this.renderElement.bind(this);
    }

    render(layers: readonly Layer[]): void {
        for (const layer of layers) {
            if (!layer.rootElement) {
                throw new Error(`Layer with key ${layer.key} is missing rootElement. This is an error because it means you are creating unnecessary layers.`);
            }

            this.renderElement(layer.rootElement);
        }
    }

    protected renderElement(element: UiElement) {
        const { context } = this;
        const { bounds } = element;

        context.save();
        context.beginPath();
        context.rect(bounds.x, bounds.y, bounds.w, bounds.h);
        context.clip();

        for (const command of element.drawBuffer) {
            if (command.native) {
                (context[command.command] as any)(...command.args);
            } else {
                command.command(context, command.args);
            }
        }

        for (const child of element.children) {
            this.renderElement(child);
        }

        context.restore();
    }
}

