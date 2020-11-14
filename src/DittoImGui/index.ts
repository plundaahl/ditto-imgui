import { DittoContext } from './DittoContext';
import { DittoContextImpl } from './DittoContextImpl';
import { HookRunnerImpl } from './infrastructure/HookRunner';
import { InfraContainerImpl } from './infrastructure';
import { FrameTimeTrackerImpl } from './infrastructure/FrameTimeTracker';

import { CoreImpl } from './core';
import { KeyServiceImpl } from './core/KeyService';
import { ElementServiceImpl } from './core/ElementService';
import { LayerServiceImpl } from './core/LayerService';
import { RenderServiceImpl } from './core/RenderService';

import { ServiceManagerImpl } from './services';
import { DrawServiceImpl } from './services/DrawService';
import { MouseServiceImpl, createMouseWatcher } from './services/MouseService';
import { StateServiceImpl } from './services/StateService';
import { LayoutServiceImpl } from './services/LayoutService';
import { FocusServiceImpl } from './services/FocusService';
import { BrowserFocusHandleImpl, configureFocusElements } from './services/FocusService/BrowserFocusHandle';
import { KeyboardServiceImpl } from './services/KeyboardService';
import { ControllerServiceImpl } from './services/ControllerService';
import { MouseController } from './controllers/MouseController';
import { ObjectPool } from './lib/ObjectPool';
import { ElementFactoryImpl } from './factories/ElementFactory';
import { basicVerticalLayoutFn } from './defaults/layout';

let dittoContextSingleton: DittoContext;

export function createContext(canvas: HTMLCanvasElement) {
    if (dittoContextSingleton) {
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

    const mouseWatcher = createMouseWatcher(canvas);
    (window as any).mouseWatcher = mouseWatcher;

    const infraContainer = new InfraContainerImpl(
        new FrameTimeTrackerImpl(Date.now),
    );

    const core = new CoreImpl(
        new KeyServiceImpl(),
        new ElementServiceImpl(elementPool),
        new LayerServiceImpl(),
        new RenderServiceImpl(canvasContext),
    );
    
    const serviceManager = new ServiceManagerImpl(
        new HookRunnerImpl(),
        new DrawServiceImpl(),
        new MouseServiceImpl(mouseWatcher),
        new StateServiceImpl(),
        new LayoutServiceImpl(basicVerticalLayoutFn),
        new FocusServiceImpl(
            new BrowserFocusHandleImpl(
                canvas,
                ...configureFocusElements(canvas),
            ),
        ),
        new KeyboardServiceImpl(document),
        new ControllerServiceImpl(),
    );

    serviceManager.controller.registerController(new MouseController(serviceManager.mouse));

    dittoContextSingleton = new DittoContextImpl(
        infraContainer,
        core,
        serviceManager,
    );
}

export function getContext(): DittoContext {
    return dittoContextSingleton;
}

export { DittoContext } from './DittoContext';
