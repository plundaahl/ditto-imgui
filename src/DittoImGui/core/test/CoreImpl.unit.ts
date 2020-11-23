import { notUndefined } from './notUndefined';
import { Core } from '../Core';
import { CoreImpl } from '../CoreImpl';
import { KeyService, KeyServiceImpl } from '../KeyService';
import { RenderService, RenderServiceImpl } from '../RenderService';
import { LayerService, LayerServiceImpl } from '../LayerService';
import { ElementService, ElementServiceImpl } from '../ElementService';
import { ElementFactoryImpl } from '../../factories/ElementFactory';
import { ObjectPool } from '../../lib/ObjectPool';
import { createFakeCanvasContext } from './createFakeCanvasContext';
import { Layer, UiElement } from '../../types';
import { spy } from './spy';

let keyBuilder: KeyService;
let renderer: RenderService;
let layerBuilder: LayerService;
let elementService: ElementService;
let instance: Core;

beforeEach(() => {
    keyBuilder = spy(new KeyServiceImpl());
    renderer = spy(new RenderServiceImpl(createFakeCanvasContext()));
    layerBuilder = spy(new LayerServiceImpl());

    const elementFactory = new ElementFactoryImpl({ zIndex: -1, key: '__default' });
    elementService = spy(new ElementServiceImpl(
        new ObjectPool<UiElement>(
            elementFactory.createElement,
            elementFactory.resetElement,
        ),
    ));

    instance = new CoreImpl(
        keyBuilder,
        elementService,
        layerBuilder,
        renderer,
    );
});

describe('beginLayer', () => {
    const key = 'akey';
    const flags = 128;
    const qualifiedKey = key;

    beforeEach(() => {
        instance.beginLayer(key, flags);
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

    test('should pass qualifiedKey and flags into elementBuilder.beginLayer', () => {
        expect(elementService.beginElement).toHaveBeenCalledWith(qualifiedKey, flags);
    });

    test('should link new layer and its root element', () => {
        const currentLayer = notUndefined(layerBuilder.getCurrentLayer());
        const currentElement = notUndefined(elementService.getCurrentElement());

        expect(currentElement.layer).toBe(currentLayer);
        expect(currentLayer.rootElement).toBe(currentElement);
    });
});

describe('endLayer', () => {
    describe('given no layer is present', () => {
        test('should error', () => {
            expect(instance.endLayer).toThrow();
        });
    });

    describe('given one or more layers are present', () => {
        let prevLayer: Layer;

        beforeEach(() => {
            instance.beginLayer('layerA', 0);
            prevLayer = notUndefined(layerBuilder.getCurrentLayer());

            instance.beginLayer('layerB', 0);

            jest.clearAllMocks();
            instance.endLayer();
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
        test('should set current layer to previous layer before call', () => {
            expect(layerBuilder.getCurrentLayer()).toBe(prevLayer);
        });

        test('should pass current layer into elementBuilder.setCurrentLayer', () => {
            const curLayer = layerBuilder.getCurrentLayer();
            expect(elementService.setCurrentLayer).toHaveBeenCalledWith(curLayer);
        });
    });
});

describe('beginElement', () => {
    describe('given no layer has been created', () => {
        test('should error', () => {
            expect(() => instance.beginElement('anykey', 0)).toThrow();
        });
    });


    describe('given a layer has been created', () => {
        const key = 'elementkey';
        const flags = 128;

        beforeEach(() => {
            instance.beginLayer('layer', 0);
            instance.beginElement(key, flags);
        });

        test('should pass key into keyBuilder.push', () => {
            expect(keyBuilder.push).toHaveBeenCalledWith(key);
        });

        test('should pass qualified key and flags into elementBuilder.beginElement', () => {
            const qualifiedKey = keyBuilder.getCurrentQualifiedKey();
            expect(elementService.beginElement)
                .toHaveBeenCalledWith(qualifiedKey, flags);
        });
    });
});

describe('endElement', () => {
    describe("given next element to remove is a layer's rootElement", () => {
        beforeEach(() => instance.beginLayer('layer', 0));

        test('should error', () => {
            expect(instance.endElement).toThrow();
        });
    });

    describe("given no layer is present", () => {
        test('should error', () => {
            expect(instance.endElement).toThrow();
        });
    });

    describe("given a layer is present and element is not layer's rootElement", () => {
        beforeEach(() => {
            instance.beginLayer('layer', 0);
            instance.beginElement('element', 0);

            jest.clearAllMocks();
            instance.endElement();
        });

        test('should call elementBuilder.endElement', () => {
            expect(elementService.endElement).toHaveBeenCalled();
        });

        test('should call keyBuilder.pop', () => {
            expect(keyBuilder.pop).toHaveBeenCalled();
        });
    });
});

describe('currentLayer.bringToFront', () => {
    describe('given no layer is present', () => {
        test('should error', () => {
            expect(instance.layer.bringToFront).toThrow();
        });
    });

    test('should call layerBuilder.bringCurrentLayerToFront', () => {
        instance.beginLayer('somelayer', 0);
        instance.layer.bringToFront();

        expect(layerBuilder.bringToFront).toHaveBeenCalled();
    });
});

describe('render', () => {
    describe('given not all layers have been ended', () => {
        beforeEach(() => {
            instance.beginLayer('foo', 0);
        });

        test('should error', () => {
            expect(instance.render).toThrow();
        });
    });

    describe('given all layers and elements have been ended', () => {
        beforeEach(() => {
            instance.beginLayer('foo', 0);
            instance.beginElement('baz', 0);
            instance.endElement();
            instance.endLayer();

            instance.beginLayer('bar', 0);
            instance.endLayer();

            jest.clearAllMocks();

            instance.preRender();
            instance.render();
            instance.postRender();
        });

        test('should call layerBuilder.onPreRender', () => {
            expect(layerBuilder.onPreRender).toHaveBeenCalled();
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
    });

    describe('multiple render calls', () => {
        function mockDrawPhase() {
            instance.beginLayer('foo', 0);
            instance.beginElement('baz', 0);
            instance.endElement();
            instance.endLayer();
            instance.beginLayer('bar', 0);
            instance.endLayer();
        }

        test('should work fine', () => {
            mockDrawPhase();
            instance.preRender();
            instance.render();
            instance.postRender();

            mockDrawPhase();
            instance.preRender();
            instance.render();
            instance.postRender();

            mockDrawPhase();
            instance.preRender();
            instance.render();
            instance.postRender();
        });
    });
});

