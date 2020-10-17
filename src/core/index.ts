import { GuiContext } from './GuiContext';
import { GuiContextImpl } from './GuiContextImpl';
import { KeyBuilderImpl } from './systems/KeyBuilder';
import { ElementBuilderImpl } from './systems/ElementBuilder';
import { LayerBuilderImpl } from './systems/LayerBuilder';
import { DrawHandlerImpl } from './systems/DrawHandler';
import { RendererImpl } from './systems/Renderer';
import { MouseHandlerImpl, createMouseWatcher } from './systems/MouseHandler';
import { StateManagerImpl } from './systems/StateManager';
import { LayoutHandlerImpl } from './systems/LayoutHandler';
import { FocusManagerImpl } from './systems/FocusManager';
import { ObjectPool } from './lib/ObjectPool';
import { ElementFactoryImpl } from './factories/ElementFactory';
import { basicVerticalLayoutFn } from './defaults/layout';

let guiContextSingleton: GuiContext;

export function createContext(canvas: HTMLCanvasElement) {
    if (guiContextSingleton) {
        return;
    }

    const canvasContext = canvas.getContext('2d');
    if (canvasContext === null) {
        throw new Error('Cannot get canvas context');
    }

    const elementFactory = new ElementFactoryImpl({ key: '__default', zIndex: 0 });

    const elementPool = new ObjectPool(
        elementFactory.createElement,
        elementFactory.resetElement,
    );

    guiContextSingleton = guiContextSingleton || new GuiContextImpl(
        new KeyBuilderImpl(),
        new ElementBuilderImpl(elementPool),
        new LayerBuilderImpl(),
        new DrawHandlerImpl(),
        new RendererImpl(canvasContext),
        new MouseHandlerImpl(createMouseWatcher(canvas)),
        new StateManagerImpl(),
        new LayoutHandlerImpl(basicVerticalLayoutFn),
        new FocusManagerImpl(),
    );
}

export function getContext(): GuiContext {
    return guiContextSingleton;
}

export { GuiContext } from './GuiContext';
