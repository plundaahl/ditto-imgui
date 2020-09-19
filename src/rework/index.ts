import { Context, ContextImpl } from './Context';
import { StateManagerImpl } from './StateManager';
import { createCanvasContext } from './DrawBuffer';

let context: Context | undefined;

export function getContext(): Context {
    if (!context) {
        context = new ContextImpl({
            createCanvasFn: createCanvasContext,
            stateManager: new StateManagerImpl(),
        });
    }
    return context;
}

export { Context } from './Context';
