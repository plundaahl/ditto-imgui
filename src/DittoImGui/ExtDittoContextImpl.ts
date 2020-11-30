import { DittoContextImpl } from './DittoContextImpl';
import { HookRunnerImpl } from './infrastructure/HookRunner';
import { InfraContainerImpl } from './infrastructure';
import { FrameTimeTrackerImpl } from './infrastructure/FrameTimeTracker';

import { CoreImpl } from './core';
import { KeyServiceImpl } from './core/KeyService';
import { ElementServiceImpl } from './core/ElementService';
import { LayerServiceImpl } from './core/LayerService';
import { RenderServiceImpl } from './core/RenderService';

import { ServiceManagerImpl, ServiceManager } from './services';
import { DrawServiceImpl } from './services/DrawService';
import { MouseServiceImpl, createMouseWatcher } from './services/MouseService';
import { StateServiceImpl } from './services/StateService';
import { LayoutServiceImpl, LayoutFunction } from './services/LayoutService';
import { FocusServiceImpl } from './services/FocusService';
import { BrowserFocusHandleImpl, configureFocusElements } from './services/FocusService/BrowserFocusHandle';
import { KeyboardServiceImpl } from './services/KeyboardService';
import { BoundsServiceImpl } from './services/BoundsService';

import { ObjectPool } from './lib/ObjectPool';
import { ElementFactoryImpl } from './factories/ElementFactory';

import { ControllerManagerImpl } from './controllers';
import { MouseControllerFactory } from './controllers/MouseController';

/*
 * Simplifies the API by encapsulating DittoContextImpl's object composition.
 */
export class ExtDittoContextImpl extends DittoContextImpl {
    constructor(
        canvas: HTMLCanvasElement,
        defaultLayout: LayoutFunction,
    ) {
        const canvasContext = canvas.getContext('2d');
        if (canvasContext === null) {
            throw new Error('Cannot get canvas context');
        }
    
        const elementFactory = new ElementFactoryImpl({ key: '__default', zIndex: 0 });
        let serviceManager: ServiceManager;
        super(
            new InfraContainerImpl(
                new FrameTimeTrackerImpl(Date.now),
            ),
            new CoreImpl(
                new KeyServiceImpl(),
                new ElementServiceImpl(
                    new ObjectPool(
                        elementFactory.createElement,
                        elementFactory.resetElement,
                    ),
                ),
                new LayerServiceImpl(),
                new RenderServiceImpl(canvasContext),
            ),
            serviceManager = new ServiceManagerImpl(
                new HookRunnerImpl(),
                new DrawServiceImpl(),
                new MouseServiceImpl(createMouseWatcher(canvas)),
                new StateServiceImpl(),
                new LayoutServiceImpl(defaultLayout),
                new FocusServiceImpl(
                    new BrowserFocusHandleImpl(
                        canvas,
                        ...configureFocusElements(canvas),
                    ),
                ),
                new KeyboardServiceImpl(document),
                new BoundsServiceImpl(),
            ),
            new ControllerManagerImpl(
                serviceManager,
                new MouseControllerFactory(),
            ),
        );
    }
}

