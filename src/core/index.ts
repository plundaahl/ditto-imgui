import { DittoContext } from './DittoContext';
import { DittoContextImpl } from './DittoContextImpl';
import {
    ControllerManagerImpl,
    MouseController,
} from './ControllerManager';
import {
    KeyboardController,
    KeyMap,
} from './ControllerManager/controllers/KeyboardController';
import { ServiceManagerImpl } from './ServiceManager/ServiceManagerImpl';
import { KeyServiceImpl } from './ServiceManager/services/KeyService';
import { ElementServiceImpl } from './ServiceManager/services/ElementService';
import { LayerServiceImpl } from './ServiceManager/services/LayerService';
import { DrawServiceImpl } from './ServiceManager/services/DrawService';
import { RenderServiceImpl } from './ServiceManager/services/RenderService';
import { MouseServiceImpl, createMouseWatcher } from './ServiceManager/services/MouseService';
import { StateServiceImpl } from './ServiceManager/services/StateService';
import { LayoutServiceImpl } from './ServiceManager/services/LayoutService';
import { FocusServiceImpl } from './ServiceManager/services/FocusService';
import { KeyboardServiceImpl, createKeyboardEntryObjectPool } from './ServiceManager/services/KeyboardService';
import { ObjectPool } from './lib/ObjectPool';
import { ElementFactoryImpl } from './factories/ElementFactory';
import { basicVerticalLayoutFn } from './defaults/layout';

let dittoContextSingleton: DittoContext;

export function createContext(canvas: HTMLCanvasElement) {
    if (dittoContextSingleton) {
        return;
    }

    const keymap: KeyMap = {
        trigger: [ 'Enter' ],
        toggle: [ 'Space' ],
        query: [ 'ContextMenu' ],
        cancel: [ 'Escape' ],
        moveLeft: [ 'ArrowLeft' ],
        moveRight: [ 'ArrowRight' ],
        moveUp: [ 'ArrowUp' ],
        moveDown: [ 'ArrowDown' ],
    };

    const canvasContext = canvas.getContext('2d');
    if (canvasContext === null) {
        throw new Error('Cannot get canvas context');
    }

    const elementFactory = new ElementFactoryImpl({ key: '__default', zIndex: 0 });

    const elementPool = new ObjectPool(
        elementFactory.createElement,
        elementFactory.resetElement,
    );

    const mouseWatcher = createMouseWatcher(canvas);
    (window as any).mouseWatcher = mouseWatcher;
    
    const serviceManager = new ServiceManagerImpl(
        new KeyServiceImpl(),
        new ElementServiceImpl(elementPool),
        new LayerServiceImpl(),
        new DrawServiceImpl(),
        new RenderServiceImpl(canvasContext),
        new MouseServiceImpl(mouseWatcher),
        new StateServiceImpl(),
        new LayoutServiceImpl(basicVerticalLayoutFn),
        new FocusServiceImpl(),
        new KeyboardServiceImpl(
            createKeyboardEntryObjectPool(),
            document,
        ),
    );

    dittoContextSingleton = new DittoContextImpl(
        serviceManager,
        new ControllerManagerImpl(
            new MouseController(serviceManager.mouse),
            new KeyboardController(
                serviceManager.keyboard,
                serviceManager.focus,
                keymap,
            ),
        ),
    );
}

export function getContext(): DittoContext {
    return dittoContextSingleton;
}

export { DittoContext } from './DittoContext';
