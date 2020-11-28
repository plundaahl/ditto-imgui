import { DittoContext } from './DittoContext';
import * as DittoContextFactory from './DittoContextFactory';

let dittoContextSingleton: DittoContext;

export function createContext(canvas: HTMLCanvasElement) {
    if (dittoContextSingleton) {
        return;
    }
    dittoContextSingleton = DittoContextFactory.createContext(canvas);
}

export function getContext(): DittoContext {
    return dittoContextSingleton;
}

export { DittoContext } from './DittoContext';
export { StateComponentKey } from './services/StateService';
export * from './flags';
