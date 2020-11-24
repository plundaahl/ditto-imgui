import { ServiceManager } from '../ServiceManager';
import { ServiceManagerImpl } from '../ServiceManagerImpl';
import { HookRunner, HookRunnerImpl } from '../../infrastructure/HookRunner';
import { DrawService, DrawServiceImpl } from '../DrawService';
import { Layer, UiElement } from '../../types';
import { MouseService, MouseServiceImpl, MouseAction } from '../MouseService';
import { StateService, StateServiceImpl } from '../StateService';
import { LayoutService, LayoutServiceImpl } from '../LayoutService';
import { FocusService, FocusServiceImpl } from '../FocusService';
import { KeyboardService, KeyboardServiceImpl } from '../KeyboardService';
import { BoundsService, BoundsServiceImpl } from '../BoundsService';
import { spy } from './spy';
import { createTestBrowserFocusHandle } from '../FocusService/test/createTestBrowserFocusHandle';

let hookRunner: HookRunner;
let drawService: DrawService;
let serviceManager: ServiceManager;
let mouseHandler: MouseService;
let stateManager: StateService;
let layoutHandler: LayoutService;
let focusManager: FocusService;
let keyboardService: KeyboardService;
let boundsService: BoundsService;

beforeEach(() => {
    hookRunner = spy(new HookRunnerImpl());
    drawService = spy(new DrawServiceImpl());
    stateManager = spy(new StateServiceImpl());
    layoutHandler = spy(new LayoutServiceImpl(jest.fn()));
    focusManager = spy(new FocusServiceImpl(createTestBrowserFocusHandle()));
    mouseHandler = spy(new MouseServiceImpl({
        posX: 50,
        posY: 50,
        dragX: 0,
        dragY: 0,
        isOverCanvas: true,
        m1Down: false,
        m2Down: false,
        action: MouseAction.NONE,
    }));
    keyboardService = spy(new KeyboardServiceImpl(
        { addEventListener: jest.fn() },
    ));
    boundsService = spy(new BoundsServiceImpl());

    serviceManager = new ServiceManagerImpl(
        hookRunner,
        drawService,
        mouseHandler,
        stateManager,
        layoutHandler,
        focusManager,
        keyboardService,
        boundsService,
    );
});

describe('constructor', () => {
    test('should register mouseHandler with hookRunner', () => {
        expect(hookRunner.registerHookable).toHaveBeenCalledWith(mouseHandler);
    });

    test('should register stateService with hookRunner', () => {
        expect(hookRunner.registerHookable).toHaveBeenCalledWith(stateManager);
    });

    test('should register drawService with hookRunner', () => {
        expect(hookRunner.registerHookable).toHaveBeenCalledWith(drawService);
    });

    test('should register layoutHandler with hookRunner', () => {
        expect(hookRunner.registerHookable).toHaveBeenCalledWith(layoutHandler);
    });

    test('should register focusManager with hookRunner', () => {
        expect(hookRunner.registerHookable).toHaveBeenCalledWith(focusManager);
    });

    test('should register keyboardService with hookRunner', () => {
        expect(hookRunner.registerHookable).toHaveBeenCalledWith(keyboardService);
    });

    test('should register boundsService with hookRunner', () => {
        expect(hookRunner.registerHookable).toHaveBeenCalledWith(boundsService);
    });
});

describe('beginLayer', () => {
    let layer: Layer;

    beforeEach(() => {
        layer = createLayer('somekey');
        serviceManager.beginLayer(layer);
    });

    test('should call hookRunner.runOnBeginLayer hook', () => {
        expect(hookRunner.runOnBeginLayerHook).toHaveBeenCalled();
    });

    test('should call hookRunner.runOnBeginElement hook', () => {
        expect(hookRunner.runOnBeginElementHook).toHaveBeenCalled();
    });

    test('should pass qualifiedKey into stateManager.onBeginKey', () => {
        expect(stateManager.onBeginElement).toHaveBeenCalled();
    });

    test('should pass root element into drawHandler.onBeginElement', () => {
        expect(drawService.onBeginElement).toHaveBeenCalledWith(layer.rootElement);
    });

    test('should pass root element into mouseHandler.onBeginElement', () => {
        expect(mouseHandler.onBeginElement).toHaveBeenCalledWith(layer.rootElement);
    });

    test('should pass root element into layoutHandler.onBeginElement', () => {
        expect(layoutHandler.onBeginElement).toHaveBeenCalledWith(layer.rootElement);
    });

    test('should pass root element into focusManager.onBeginElement', () => {
        expect(focusManager.onBeginElement).toHaveBeenCalledWith(layer.rootElement);
    });
});

describe('endLayer', () => {
    describe('given no layer is present', () => {
        test('should error', () => {
            expect(serviceManager.endLayer).toThrow();
        });
    });

    describe('given one or more layers are present', () => {
        let layer: Layer;

        beforeEach(() => {
            layer = createLayer('thiskey');
            serviceManager.beginLayer(layer);
            jest.clearAllMocks();
            serviceManager.endLayer();
        });

        test('should call stateManager.onEndKey', () => {
            expect(stateManager.onEndElement).toHaveBeenCalled();
        });

        test('should call drawService.onEndElement', () => {
            expect(drawService.onEndElement).toHaveBeenCalled();
        });

        test('should call hookRunner.runOnEndElementHook', () => {
            expect(hookRunner.runOnEndElementHook).toHaveBeenCalled();
        });

        test('should call hookRunner.runOnEndLayerHook', () => {
            expect(hookRunner.runOnEndLayerHook).toHaveBeenCalled();
        });

        test('should call mouseHandler.onEndElement', () => {
            expect(mouseHandler.onEndElement).toHaveBeenCalled();
        });

        test('should call layoutHandler.onEndElement', () => {
            expect(layoutHandler.onEndElement).toHaveBeenCalled();
        });

        test('should call focusManager.onEndElement', () => {
            expect(focusManager.onEndElement).toHaveBeenCalled();
        });
    });
});

describe('beginElement', () => {
    describe('given a layer has been created', () => {
        let element: UiElement;

        beforeEach(() => {
            element = createElement('anykey');
            serviceManager.beginElement(element);
        });

        test('should pass created element into drawHandler.onBeginElement', () => {
            expect(drawService.onBeginElement).toHaveBeenCalledWith(element);
        });

        test('should pass created element into mouseHandler.onBeginElement', () => {
            expect(mouseHandler.onBeginElement).toHaveBeenCalledWith(element);
        });

        test('should pass created element into layoutHandler.onBeginElement', () => {
            expect(layoutHandler.onBeginElement).toHaveBeenCalledWith(element);
        });

        test('should pass created element into focusManager.onBeginElement', () => {
            expect(focusManager.onBeginElement).toHaveBeenCalledWith(element);
        });

        test('should call hookRunner.runOnBeginElement', () => {
            expect(hookRunner.runOnBeginElementHook).toHaveBeenCalled();
        });
    });
});

describe('endElement', () => {
    describe("given no layer is present", () => {
        test('should error', () => {
            expect(serviceManager.endElement).toThrow();
        });
    });

    describe("given a layer is present", () => {
        beforeEach(() => {
            serviceManager.beginElement(createElement('akey'));
            jest.clearAllMocks();
            serviceManager.endElement();
        });

        test('should call stateManager.onEndKey', () => {
            expect(stateManager.onEndElement).toHaveBeenCalled();
        });

        test('should call drawService.onEndElement', () => {
            expect(drawService.onEndElement).toHaveBeenCalled();
        });

        test('should call mouseHandler.onEndElement', () => {
            expect(mouseHandler.onEndElement).toHaveBeenCalled();
        });

        test('should call layoutHandler.onEndElement', () => {
            expect(layoutHandler.onEndElement).toHaveBeenCalled();
        });

        test('should call focusManager.onEndElement', () => {
            expect(focusManager.onEndElement).toHaveBeenCalled();
        });

        test('should call hookRunner.runOnEndElement', () => {
            expect(hookRunner.runOnEndElementHook).toHaveBeenCalled();
        });
    });
});

describe('preRender', () => {
    beforeEach(() => serviceManager.preRender(123));

    test('should call hookRunner.runOnPreRenderHook', () => {
        expect(hookRunner.runOnPreRenderHook).toHaveBeenCalled();
    });
});

describe('postRender', () => {
    beforeEach(() => serviceManager.postRender(123));

    test('should call hookRunner.runOnPostRenderHook', () => {
        expect(hookRunner.runOnPostRenderHook).toHaveBeenCalled();
    });
});

function createLayerAndElement(key: string): [UiElement, Layer] {
    const layer: Layer = {
        key,
        zIndex: 0,
    };
    const element: UiElement = {
        key,
        layer,
        children: [],
        drawBuffer: [],
        bounds: { x: 0, y: 0, w: 0, h: 0 },
        flags: 0,
    };
    layer.rootElement = element;
    return [element, layer];
}

function createLayer(key: string): Layer {
    const [, layer] = createLayerAndElement(key);
    return layer;
}

function createElement(key: string): UiElement {
    const [element] = createLayerAndElement(key);
    return element;
}
