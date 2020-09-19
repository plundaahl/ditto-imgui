import { Context, ContextImpl } from './Context';
import { createCanvasContext } from './DrawBuffer';

let context: Context | undefined;

export function getContext(): Context {
    if (!context) {
        context = new ContextImpl(
            createCanvasContext,
        );
    }
    return context;
}

export { Context } from './Context';
