import { Context, ContextImpl } from './Context';
import { StateManagerImpl } from './StateManager';
import { createCanvasContext } from './DrawBuffer';
import { KeyCollisionDetector } from './KeyCollisionDetector';

let context: Context | undefined;

export function getContext(): Context {
    if (!context) {
        context = new ContextImpl({
            createCanvasFn: createCanvasContext,
            stateManager: new StateManagerImpl(),
            keyCollisionDetector: new KeyCollisionDetector(),
        });
    }
    return context;
}

export { Context } from './Context';
