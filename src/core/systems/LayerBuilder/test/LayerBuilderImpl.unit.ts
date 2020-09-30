import { Layer } from '../../../types';
import { LayerBuilderImpl } from '../LayerBuilderImpl';

let instance: LayerBuilderImpl;
beforeEach(() => instance = new LayerBuilderImpl());

describe('getCurrentLayer', () => {
    describe('when no layer is pushed', () => {
        test('should return undefined', () => {
            expect(instance.getCurrentLayer()).toBeUndefined();
        });
    });

    describe('when layer is pushed', () => {
        const key = 'foolayer';
        beforeEach(() => instance.beginLayer(key));

        test('should return layer matching last-pushed key', () => {
            const layer = instance.getCurrentLayer();
            if (!layer) { throw new Error('layer is undefined'); }
            expect(layer.key).toBe(key);
        });
    });
});

describe('beginLayer', () => {
    describe('given onPreRender has been called', () => {
        beforeEach(() => instance.onPreRender());

        test('should error', () => {
            expect(() => instance.beginLayer('foo')).toThrow();
        });
    });

    describe('given onPostRender has been called', () => {
        beforeEach(() => {
            instance.onPreRender();
            instance.onPostRender();
        });

        test('should error', () => {
            expect(() => instance.beginLayer('foo')).not.toThrow();
        });
    });

    describe('a layer matching key already exists', () => {
        const key = 'foolayer';
        let layer: Layer;

        beforeEach(() => {
            instance.beginLayer(key);
            layer = notUndefined(instance.getCurrentLayer());
            instance.endLayer();

            instance.onPreRender();
            instance.onPostRender();
        });

        test('should reuse specified layer', () => {
            layer.zIndex = 952;
            instance.beginLayer(key);
            expect(instance.getCurrentLayer()).toBe(layer);
        });
    });
});

describe('endLayer', () => {
    describe('when no layer is pushed', () => {
        test('should error', () => {
            expect(instance.endLayer).toThrow();
        });
    });

    describe('when not in build mode', () => {
        beforeEach(() => instance.onPreRender());

        test('should error', () => {
            expect(instance.endLayer).toThrow();
        });
    });

    describe('when layers are pushed', () => {
        const key1 = 'foolayer';
        const key2 = 'foolayer/barLayer';
        let layer1: Layer;

        beforeEach(() => {
            instance.beginLayer(key1);
            layer1 = notUndefined(instance.getCurrentLayer());
            instance.beginLayer(key2);
        });

        test('should result in current layer being that before last push', () => {
            instance.endLayer();
            expect(instance.getCurrentLayer()).toBe(layer1);
        });
    });
});

describe('bringCurrentLayerToFront', () => {
    describe('given no layers are present', () => {
        test('should error', () => {
            expect(instance.bringCurrentLayerToFront).toThrow();
        });
    });
});

describe('getOrderedLayers', () => {
    describe('before onPreRender', () => {
        test('should error', () => {
            expect(instance.getOrderedLayers).toThrow();
        });
    });

    describe('after onPostRender', () => {
        beforeEach(() => {
            instance.onPreRender();
            instance.onPostRender();
        });

        test('should error', () => {
            expect(instance.getOrderedLayers).toThrow();
        });
    });

    describe('between onPreRender and onPostRender', () => {
        beforeEach(() => {
            instance.onPreRender();
        });

        test('should not error', () => {
            expect(instance.getOrderedLayers).not.toThrow();
        });

        describe('given no layers pushed', () => {
            test('should return empty array', () => {
                expect(instance.getOrderedLayers().length).toBe(0);
            });
        });
    });

    describe('given several layers pushed', () => {
        beforeEach(() => {
            instance.beginLayer('foo');
            instance.endLayer();
            instance.beginLayer('bar');
            instance.endLayer();
            instance.beginLayer('baz');
            instance.endLayer();

            instance.onPreRender();
        });

        test('should return layers in order pushed', () => {
            const layerKeys = instance.getOrderedLayers().map(layer => layer.key);
            expect(layerKeys.length).toBe(3);
            expect(layerKeys[0]).toBe('foo');
            expect(layerKeys[1]).toBe('bar');
            expect(layerKeys[2]).toBe('baz');
        });
    });

    describe('given some existing layers were not pushed this frame', () => {
        beforeEach(() => {
            instance.beginLayer('foo');
            instance.endLayer();
            instance.beginLayer('bar');
            instance.endLayer();
            instance.beginLayer('baz');
            instance.endLayer();

            instance.onPreRender();
            instance.onPostRender();

            instance.beginLayer('foo');
            instance.endLayer();
            instance.beginLayer('bar');
            instance.endLayer();

            instance.onPreRender();
        });

        test('should not include ommitted layers', () => {
            const layerKeys = instance.getOrderedLayers().map(layer => layer.key);
            expect(layerKeys.length).toBe(2);
            expect(layerKeys[0]).toBe('foo');
            expect(layerKeys[1]).toBe('bar');
        });
    });

    describe('given some layers had asked to be moved to front', () => {
        beforeEach(() => {
            instance.beginLayer('foo');
            instance.bringCurrentLayerToFront();
            instance.endLayer();
            instance.beginLayer('bar');
            instance.endLayer();
            instance.beginLayer('baz');
            instance.bringCurrentLayerToFront();
            instance.endLayer();
            instance.beginLayer('bing');
            instance.endLayer();

            instance.onPreRender();
        });

        test('layers moved to front should be last', () => {
            const layerKeys = instance.getOrderedLayers().map(layer => layer.key);
            expect(layerKeys[2]).toBe('foo');
            expect(layerKeys[3]).toBe('baz');
        });
    });
});

describe('onPreRender', () => {
    describe('given not all layers have been ended', () => {
        beforeEach(() => instance.beginLayer('foo'));

        test('should error', () => {
            expect(instance.onPreRender).toThrow();
        });
    });
});

function notUndefined<T>(value: T | undefined): T {
    if (value === undefined) {
        throw new Error('value is undefined');
    }
    return value;
}
