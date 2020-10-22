import { notUndefined } from './notUndefined';
import { GuiContext } from '../GuiContext';
import { GuiContextImpl } from '../GuiContextImpl';
import { KeyBuilder, KeyBuilderImpl } from '../systems/KeyBuilder';
import { Renderer, RendererImpl } from '../systems/Renderer';
import { DrawHandler, DrawHandlerImpl } from '../systems/DrawHandler';
import { LayerBuilder, LayerBuilderImpl } from '../systems/LayerBuilder';
import { ElementBuilder, ElementBuilderImpl } from '../systems/ElementBuilder';
import { ElementFactoryImpl } from '../factories/ElementFactory';
import { ObjectPool } from '../lib/ObjectPool';
import { createFakeCanvasContext } from './createFakeCanvasContext';
import { Layer, UiElement } from '../types';
import { MouseHandler, MouseHandlerImpl, MouseAction } from '../systems/MouseHandler';
import { StateManager, StateManagerImpl } from '../systems/StateManager';
import { LayoutHandler, LayoutHandlerImpl } from '../systems/LayoutHandler';
import { FocusManager, FocusManagerImpl } from '../systems/FocusManager';
import { ActionPluginManager, ActionPluginManagerImpl } from '../systems/ActionPluginManager';

let keyBuilder: KeyBuilder;
let renderer: Renderer;
let drawHandler: DrawHandler;
let layerBuilder: LayerBuilder;
let elementBuilder: ElementBuilder;
let guiContext: GuiContext;
let mouseHandler: MouseHandler;
let stateManager: StateManager;
let layoutHandler: LayoutHandler;
let focusManager: FocusManager;
let actionSystem: ActionPluginManager;

beforeEach(() => {
    keyBuilder = spy(new KeyBuilderImpl());
    renderer = spy(new RendererImpl(createFakeCanvasContext()));
    drawHandler = spy(new DrawHandlerImpl());
    layerBuilder = spy(new LayerBuilderImpl());
    stateManager = spy(new StateManagerImpl());
    layoutHandler = spy(new LayoutHandlerImpl(jest.fn()));
    focusManager = spy(new FocusManagerImpl());
    actionSystem = spy(new ActionPluginManagerImpl());
    mouseHandler = spy(new MouseHandlerImpl({
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
    elementBuilder = spy(new ElementBuilderImpl(
        new ObjectPool<UiElement>(
            elementFactory.createElement,
            elementFactory.resetElement,
        ),
    ));

    guiContext = new GuiContextImpl(
        keyBuilder,
        elementBuilder,
        layerBuilder,
        drawHandler,
        renderer,
        mouseHandler,
        stateManager,
        layoutHandler,
        focusManager,
        actionSystem,
    );
});

describe('beginLayer', () => {
    const key = 'akey';
    const qualifiedKey = key;

    beforeEach(() => {
        guiContext.beginLayer(key);
    });

    test('should pass key into keyBuilder.push', () => {
        expect(keyBuilder.push).toHaveBeenCalledWith(key);
    });

    test('should pass qualifiedKey into layerBuilder.beginLayer', () => {
        expect(layerBuilder.beginLayer).toHaveBeenCalledWith(qualifiedKey);
    });

    test('should pass new layer into elementBuiler.setCurrentLayer', () => {
        const currentLayer = layerBuilder.getCurrentLayer();
        expect(elementBuilder.setCurrentLayer).toHaveBeenCalledWith(currentLayer);
    });

    test('should pass qualifiedKey into elementBuilder.beginLayer', () => {
        expect(elementBuilder.beginElement).toHaveBeenCalledWith(qualifiedKey);
    });

    test('should pass qualifiedKey into stateManager.onBeginKey', () => {
        expect(stateManager.onBeginKey).toHaveBeenCalledWith(qualifiedKey);
    });

    test('should link new layer and its root element', () => {
        const currentLayer = notUndefined(layerBuilder.getCurrentLayer());
        const currentElement = notUndefined(elementBuilder.getCurrentElement());

        expect(currentElement.layer).toBe(currentLayer);
        expect(currentLayer.rootElement).toBe(currentElement);
    });

    test('should pass root element into drawHandler.setCurrentElement', () => {
        const currentElement = elementBuilder.getCurrentElement();
        expect(drawHandler.setCurrentElement).toHaveBeenCalledWith(currentElement);
    });

    test('should pass root element into mouseHandler.onBeginElement', () => {
        const currentElement = elementBuilder.getCurrentElement();
        expect(mouseHandler.onBeginElement).toHaveBeenCalledWith(currentElement);
    });

    test('should pass root element into layoutHandler.onBeginElement', () => {
        const currentElement = elementBuilder.getCurrentElement();
        expect(layoutHandler.onBeginElement).toHaveBeenCalledWith(currentElement);
    });

    test('should pass root element into focusManager.onBeginElement', () => {
        const currentElement = elementBuilder.getCurrentElement();
        expect(focusManager.onBeginElement).toHaveBeenCalledWith(currentElement);
    });
});

describe('endLayer', () => {
    describe('given no layer is present', () => {
        test('should error', () => {
            expect(guiContext.endLayer).toThrow();
        });
    });

    describe('given one or more layers are present', () => {
        let prevLayer: Layer;

        beforeEach(() => {
            guiContext.beginLayer('layerA');
            prevLayer = notUndefined(layerBuilder.getCurrentLayer());

            guiContext.beginLayer('layerB');

            jest.clearAllMocks();
            guiContext.endLayer();
        });

        test('should call elementBuilder.endElement', () => {
            expect(elementBuilder.endElement).toHaveBeenCalled();
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
            expect(elementBuilder.setCurrentLayer).toHaveBeenCalledWith(curLayer);
        });

        test('should pass current element into drawHandle.setCurrentElement', () => {
            const curElement = elementBuilder.getCurrentElement();
            expect(drawHandler.setCurrentElement).toHaveBeenCalledWith(curElement);
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
            expect(() => guiContext.beginElement('anykey')).toThrow();
        });
    });


    describe('given a layer has been created', () => {
        const key = 'elementkey';

        beforeEach(() => {
            guiContext.beginLayer('layer');
            guiContext.beginElement(key);
        });

        test('should pass key into keyBuilder.push', () => {
            expect(keyBuilder.push).toHaveBeenCalledWith(key);
        });

        test('should pass qualified key into elementBuilder.beginElement', () => {
            const qualifiedKey = keyBuilder.getCurrentQualifiedKey();
            expect(elementBuilder.beginElement).toHaveBeenCalledWith(qualifiedKey);
        });

        test('should pass qualified key into elementBuilder.beginElement', () => {
            const qualifiedKey = keyBuilder.getCurrentQualifiedKey();
            expect(stateManager.onBeginKey).toHaveBeenCalledWith(qualifiedKey);
        });

        test('should pass created element into drawHandler.setCurrentElement', () => {
            const curElement = elementBuilder.getCurrentElement();
            expect(drawHandler.setCurrentElement).toHaveBeenCalledWith(curElement);
        });

        test('should pass created element into mouseHandler.onBeginElement', () => {
            const currentElement = elementBuilder.getCurrentElement();
            expect(mouseHandler.onBeginElement).toHaveBeenCalledWith(currentElement);
        });

        test('should pass created element into layoutHandler.onBeginElement', () => {
            const currentElement = elementBuilder.getCurrentElement();
            expect(layoutHandler.onBeginElement).toHaveBeenCalledWith(currentElement);
        });

        test('should pass created element into focusManager.onBeginElement', () => {
            const currentElement = elementBuilder.getCurrentElement();
            expect(focusManager.onBeginElement).toHaveBeenCalledWith(currentElement);
        });
    });
});

describe('endElement', () => {
    describe("given next element to remove is a layer's rootElement", () => {
        beforeEach(() => guiContext.beginLayer('layer'));

        test('should error', () => {
            expect(guiContext.endElement).toThrow();
        });
    });

    describe("given no layer is present", () => {
        test('should error', () => {
            expect(guiContext.endElement).toThrow();
        });
    });

    describe("given a layer is present and element is not layer's rootElement", () => {
        beforeEach(() => {
            guiContext.beginLayer('layer');
            guiContext.beginElement('element');

            jest.clearAllMocks();
            guiContext.endElement();
        });

        test('should call elementBuilder.endElement', () => {
            expect(elementBuilder.endElement).toHaveBeenCalled();
        });

        test('should call keyBuilder.pop', () => {
            expect(keyBuilder.pop).toHaveBeenCalled();
        });

        test('should call stateManager.onEndKey', () => {
            expect(stateManager.onEndKey).toHaveBeenCalled();
        });

        test('should pass current element into drawHandler.setCurrentElement', () => {
            const currentElement = elementBuilder.getCurrentElement();
            expect(drawHandler.setCurrentElement).toHaveBeenCalledWith(currentElement);
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
            expect(() => guiContext.currentElement).toThrow();
        });
    });

    describe('given element is present', () => {
        beforeEach(() => guiContext.beginLayer('alayer'));

        test('should return current element', () => {
            expect(guiContext.currentElement).toBe(elementBuilder.getCurrentElement());
        });
    });
});

describe('currentLayer.bringToFront', () => {
    describe('given no layer is present', () => {
        test('should error', () => {
            expect(guiContext.currentLayer.bringToFront).toThrow();
        });
    });

    test('should call layerBuilder.bringCurrentLayerToFront', () => {
        guiContext.beginLayer('somelayer');
        guiContext.currentLayer.bringToFront();

        expect(layerBuilder.bringCurrentLayerToFront).toHaveBeenCalled();
    });
});

describe('render', () => {
    describe('given not all layers have been ended', () => {
        beforeEach(() => {
            guiContext.beginLayer('foo');
        });

        test('should error', () => {
            expect(guiContext.render).toThrow();
        });
    });

    describe('given all layers and elements have been ended', () => {
        beforeEach(() => {
            guiContext.beginLayer('foo');
            guiContext.beginElement('baz');
            guiContext.endElement();
            guiContext.endLayer();

            guiContext.beginLayer('bar');
            guiContext.endLayer();

            jest.clearAllMocks();

            guiContext.render();
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
            expect(elementBuilder.onPostRender).toHaveBeenCalled();
        });

        test('should call layoutHandler.onPostRender', () => {
            expect(layoutHandler.onPostRender).toHaveBeenCalled();
        });

        test('should call focusManager.onPostRender', () => {
            expect(focusManager.onPostRender).toHaveBeenCalled();
        });
    });

    describe('multiple render calls', () => {
        function mockDrawPhase() {
            guiContext.beginLayer('foo');
            guiContext.beginElement('baz');
            guiContext.endElement();
            guiContext.endLayer();
            guiContext.beginLayer('bar');
            guiContext.endLayer();
        }

        test('should work fine', () => {
            mockDrawPhase();
            expect(guiContext.render).not.toThrow();
            mockDrawPhase();
            expect(guiContext.render).not.toThrow();
            mockDrawPhase();
            expect(guiContext.render).not.toThrow();
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

