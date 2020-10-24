import { notUndefined } from './notUndefined';
import { ServiceManager } from '../ServiceManager';
import { ServiceManagerImpl } from '../ServiceManagerImpl';
import { KeyService, KeyServiceImpl } from '../services/KeyService';
import { RenderService, RenderServiceImpl } from '../services/RenderService';
import { DrawService, DrawServiceImpl } from '../services/DrawService';
import { LayerService, LayerServiceImpl } from '../services/LayerService';
import { ElementService, ElementServiceImpl } from '../services/ElementService';
import { ElementFactoryImpl } from '../../factories/ElementFactory';
import { ObjectPool } from '../../lib/ObjectPool';
import { createFakeCanvasContext } from './createFakeCanvasContext';
import { Layer, UiElement } from '../../types';
import { MouseService, MouseServiceImpl, MouseAction } from '../services/MouseService';
import { StateService, StateServiceImpl } from '../services/StateService';
import { LayoutService, LayoutServiceImpl } from '../services/LayoutService';
import { FocusService, FocusServiceImpl } from '../services/FocusService';

let keyBuilder: KeyService;
let renderer: RenderService;
let drawService: DrawService;
let layerBuilder: LayerService;
let elementService: ElementService;
let serviceManager: ServiceManager;
let mouseHandler: MouseService;
let stateManager: StateService;
let layoutHandler: LayoutService;
let focusManager: FocusService;

beforeEach(() => {
    keyBuilder = spy(new KeyServiceImpl());
    renderer = spy(new RenderServiceImpl(createFakeCanvasContext()));
    drawService = spy(new DrawServiceImpl());
    layerBuilder = spy(new LayerServiceImpl());
    stateManager = spy(new StateServiceImpl());
    layoutHandler = spy(new LayoutServiceImpl(jest.fn()));
    focusManager = spy(new FocusServiceImpl());
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

    const elementFactory = new ElementFactoryImpl({ zIndex: -1, key: '__default' });
    elementService = spy(new ElementServiceImpl(
        new ObjectPool<UiElement>(
            elementFactory.createElement,
            elementFactory.resetElement,
        ),
    ));

    serviceManager = new ServiceManagerImpl(
        keyBuilder,
        elementService,
        layerBuilder,
        drawService,
        renderer,
        mouseHandler,
        stateManager,
        layoutHandler,
        focusManager,
    );
});

describe('beginLayer', () => {
    const key = 'akey';
    const qualifiedKey = key;

    beforeEach(() => {
        serviceManager.beginLayer(key);
    });

    test('should pass key into keyBuilder.push', () => {
        expect(keyBuilder.push).toHaveBeenCalledWith(key);
    });

    test('should pass qualifiedKey into layerBuilder.beginLayer', () => {
        expect(layerBuilder.beginLayer).toHaveBeenCalledWith(qualifiedKey);
    });

    test('should pass new layer into elementBuiler.setCurrentLayer', () => {
        const currentLayer = layerBuilder.getCurrentLayer();
        expect(elementService.setCurrentLayer).toHaveBeenCalledWith(currentLayer);
    });

    test('should pass qualifiedKey into elementBuilder.beginLayer', () => {
        expect(elementService.beginElement).toHaveBeenCalledWith(qualifiedKey);
    });

    test('should pass qualifiedKey into stateManager.onBeginKey', () => {
        expect(stateManager.onBeginKey).toHaveBeenCalledWith(qualifiedKey);
    });

    test('should link new layer and its root element', () => {
        const currentLayer = notUndefined(layerBuilder.getCurrentLayer());
        const currentElement = notUndefined(elementService.getCurrentElement());

        expect(currentElement.layer).toBe(currentLayer);
        expect(currentLayer.rootElement).toBe(currentElement);
    });

    test('should pass root element into drawHandler.setCurrentElement', () => {
        const currentElement = elementService.getCurrentElement();
        expect(drawService.setCurrentElement).toHaveBeenCalledWith(currentElement);
    });

    test('should pass root element into mouseHandler.onBeginElement', () => {
        const currentElement = elementService.getCurrentElement();
        expect(mouseHandler.onBeginElement).toHaveBeenCalledWith(currentElement);
    });

    test('should pass root element into layoutHandler.onBeginElement', () => {
        const currentElement = elementService.getCurrentElement();
        expect(layoutHandler.onBeginElement).toHaveBeenCalledWith(currentElement);
    });

    test('should pass root element into focusManager.onBeginElement', () => {
        const currentElement = elementService.getCurrentElement();
        expect(focusManager.onBeginElement).toHaveBeenCalledWith(currentElement);
    });
});

describe('endLayer', () => {
    describe('given no layer is present', () => {
        test('should error', () => {
            expect(serviceManager.endLayer).toThrow();
        });
    });

    describe('given one or more layers are present', () => {
        let prevLayer: Layer;

        beforeEach(() => {
            serviceManager.beginLayer('layerA');
            prevLayer = notUndefined(layerBuilder.getCurrentLayer());

            serviceManager.beginLayer('layerB');

            jest.clearAllMocks();
            serviceManager.endLayer();
        });

        test('should call elementBuilder.endElement', () => {
            expect(elementService.endElement).toHaveBeenCalled();
        });

        test('should call layerBuilder.endLayer', () => {
            expect(layerBuilder.endLayer).toHaveBeenCalled();
        });

        test('should call keyBuilder.pop', () => {
            expect(keyBuilder.pop).toHaveBeenCalled();
        });

        test('should call stateManager.onEndKey', () => {
            expect(stateManager.onEndKey).toHaveBeenCalled();
        });

        test('should set current layer to previous layer before call', () => {
            expect(layerBuilder.getCurrentLayer()).toBe(prevLayer);
        });

        test('should pass current layer into elementBuilder.setCurrentLayer', () => {
            const curLayer = layerBuilder.getCurrentLayer();
            expect(elementService.setCurrentLayer).toHaveBeenCalledWith(curLayer);
        });

        test('should pass current element into drawHandle.setCurrentElement', () => {
            const curElement = elementService.getCurrentElement();
            expect(drawService.setCurrentElement).toHaveBeenCalledWith(curElement);
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
    describe('given no layer has been created', () => {
        test('should error', () => {
            expect(() => serviceManager.beginElement('anykey')).toThrow();
        });
    });


    describe('given a layer has been created', () => {
        const key = 'elementkey';

        beforeEach(() => {
            serviceManager.beginLayer('layer');
            serviceManager.beginElement(key);
        });

        test('should pass key into keyBuilder.push', () => {
            expect(keyBuilder.push).toHaveBeenCalledWith(key);
        });

        test('should pass qualified key into elementBuilder.beginElement', () => {
            const qualifiedKey = keyBuilder.getCurrentQualifiedKey();
            expect(elementService.beginElement).toHaveBeenCalledWith(qualifiedKey);
        });

        test('should pass qualified key into elementBuilder.beginElement', () => {
            const qualifiedKey = keyBuilder.getCurrentQualifiedKey();
            expect(stateManager.onBeginKey).toHaveBeenCalledWith(qualifiedKey);
        });

        test('should pass created element into drawHandler.setCurrentElement', () => {
            const curElement = elementService.getCurrentElement();
            expect(drawService.setCurrentElement).toHaveBeenCalledWith(curElement);
        });

        test('should pass created element into mouseHandler.onBeginElement', () => {
            const currentElement = elementService.getCurrentElement();
            expect(mouseHandler.onBeginElement).toHaveBeenCalledWith(currentElement);
        });

        test('should pass created element into layoutHandler.onBeginElement', () => {
            const currentElement = elementService.getCurrentElement();
            expect(layoutHandler.onBeginElement).toHaveBeenCalledWith(currentElement);
        });

        test('should pass created element into focusManager.onBeginElement', () => {
            const currentElement = elementService.getCurrentElement();
            expect(focusManager.onBeginElement).toHaveBeenCalledWith(currentElement);
        });
    });
});

describe('endElement', () => {
    describe("given next element to remove is a layer's rootElement", () => {
        beforeEach(() => serviceManager.beginLayer('layer'));

        test('should error', () => {
            expect(serviceManager.endElement).toThrow();
        });
    });

    describe("given no layer is present", () => {
        test('should error', () => {
            expect(serviceManager.endElement).toThrow();
        });
    });

    describe("given a layer is present and element is not layer's rootElement", () => {
        beforeEach(() => {
            serviceManager.beginLayer('layer');
            serviceManager.beginElement('element');

            jest.clearAllMocks();
            serviceManager.endElement();
        });

        test('should call elementBuilder.endElement', () => {
            expect(elementService.endElement).toHaveBeenCalled();
        });

        test('should call keyBuilder.pop', () => {
            expect(keyBuilder.pop).toHaveBeenCalled();
        });

        test('should call stateManager.onEndKey', () => {
            expect(stateManager.onEndKey).toHaveBeenCalled();
        });

        test('should pass current element into drawHandler.setCurrentElement', () => {
            const currentElement = elementService.getCurrentElement();
            expect(drawService.setCurrentElement).toHaveBeenCalledWith(currentElement);
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

describe('currentElement', () => {
    describe('given no element is present', () => {
        test('should error', () => {
            expect(() => serviceManager.element).toThrow();
        });
    });

    describe('given element is present', () => {
        beforeEach(() => serviceManager.beginLayer('alayer'));

        test('should return current element', () => {
            expect(serviceManager.element).toBe(elementService.getCurrentElement());
        });
    });
});

describe('currentLayer.bringToFront', () => {
    describe('given no layer is present', () => {
        test('should error', () => {
            expect(serviceManager.layer.bringToFront).toThrow();
        });
    });

    test('should call layerBuilder.bringCurrentLayerToFront', () => {
        serviceManager.beginLayer('somelayer');
        serviceManager.layer.bringToFront();

        expect(layerBuilder.bringToFront).toHaveBeenCalled();
    });
});

describe('render', () => {
    describe('given not all layers have been ended', () => {
        beforeEach(() => {
            serviceManager.beginLayer('foo');
        });

        test('should error', () => {
            expect(serviceManager.render).toThrow();
        });
    });

    describe('given all layers and elements have been ended', () => {
        beforeEach(() => {
            serviceManager.beginLayer('foo');
            serviceManager.beginElement('baz');
            serviceManager.endElement();
            serviceManager.endLayer();

            serviceManager.beginLayer('bar');
            serviceManager.endLayer();

            jest.clearAllMocks();

            serviceManager.render();
        });

        test('should call layerBuilder.onPreRender', () => {
            expect(layerBuilder.onPreRender).toHaveBeenCalled();
        });

        test('should call mouseHandler.onLayersSorted', () => {
            expect(mouseHandler.onLayersSorted).toHaveBeenCalled();
        });

        test('should call renderer.render', () => {
            expect(renderer.render).toHaveBeenCalled();
        });

        test('should call layerBuilder.onPostRender', () => {
            expect(layerBuilder.onPostRender).toHaveBeenCalled();
        });

        test('should call elementBuilder.onPostRender', () => {
            expect(elementService.onPostRender).toHaveBeenCalled();
        });

        test('should call layoutHandler.onPostRender', () => {
            expect(layoutHandler.onPostRender).toHaveBeenCalled();
        });

        test('should call focusManager.onPostRender', () => {
            expect(focusManager.onPreRender).toHaveBeenCalled();
        });
    });

    describe('multiple render calls', () => {
        function mockDrawPhase() {
            serviceManager.beginLayer('foo');
            serviceManager.beginElement('baz');
            serviceManager.endElement();
            serviceManager.endLayer();
            serviceManager.beginLayer('bar');
            serviceManager.endLayer();
        }

        test('should work fine', () => {
            mockDrawPhase();
            expect(serviceManager.render).not.toThrow();
            mockDrawPhase();
            expect(serviceManager.render).not.toThrow();
            mockDrawPhase();
            expect(serviceManager.render).not.toThrow();
        });
    });
});

function spy<T extends {[key: string]: any}>(obj: T) {
    for (const prop in obj) {
        if (obj.hasOwnProperty(prop) && typeof obj[prop] === 'function') {
            obj[prop] = jest.fn(obj[prop]) as any;
        }
    }
    return obj;
}
