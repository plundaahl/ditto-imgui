import { ObjectPool } from '../../../lib/ObjectPool';
import { ElementFactory, ElementFactoryImpl } from '../../../factories/ElementFactory';
import { Layer, UiElement } from '../../../types';
import { ElementBuilderImpl } from '../ElementBuilderImpl';

let factory: ElementFactory;
let pool: ObjectPool<UiElement>;
let instance: ElementBuilderImpl;

beforeEach(() => {
    factory = new ElementFactoryImpl({ key: '__default', zIndex: -1 });

    pool = new ObjectPool(factory.createElement, factory.resetElement);
    pool.provision = jest.fn(pool.provision);
    pool.release = jest.fn(pool.release);

    instance = new ElementBuilderImpl(pool);
});

describe('getCurrentElement', () => {
    describe('given no element is present', () => {
        test('should return undefined', () => {
            expect(instance.getCurrentElement()).toBeUndefined();
        });
    });

    describe('given elements are pushed', () => {
        test('should return the last element pushed', () => {
        });
    });
});

describe('beginElement', () => {

    test("should call objectPool's provision method", () => {
        instance.setCurrentLayer({ key: 'layerkey', zIndex: -1 });
        instance.beginElement('somekey');

        expect(pool.provision).toHaveBeenCalled();
    });

    describe('created element', () => {
        const key = 'somekey';
        let layer: Layer;
        let element: UiElement;

        beforeEach(() => {
            layer = {
                key: 'layerkey',
                zIndex: -1,
            };
            instance.setCurrentLayer(layer);
            instance.beginElement(key);
            const elem = instance.getCurrentElement();
            if (!elem) {
                throw new Error('element is undefined');
            }
            element = elem;
        });

        test('should create element with provided key', () => {
            expect(element.key).toBe(key);
        });

        test('should create element with current layer', () => {
            expect(element.layer).toBe(layer);
        });

        describe('given parent exists', () => {
            const childKey = `${key}/childkey`;
            let parent: UiElement;
            let child: UiElement | undefined;

            beforeEach(() => {
                parent = element;
                instance.beginElement(childKey);
                child = instance.getCurrentElement();
            });

            test('should have parent property set to parent element', () => {
                if (!child) { throw new Error('child is undefined'); }
                expect(child.parent).toBe(parent);
            });

            test("should add child to parent's children array", () => {
                if (!child) { throw new Error('child is undefined'); }
                expect(parent.children.includes(child)).toBe(true);
            });
        });
    });

    describe('given successive calls without an endElement call', () => {
        let parent: UiElement | undefined;
        let child: UiElement | undefined;

        beforeEach(() => {
            instance.setCurrentLayer({
                key: 'somelayer',
                zIndex: -1,
            });

            instance.beginElement('parent');
            parent = instance.getCurrentElement();
            instance.beginElement('child');
            child = instance.getCurrentElement();
        });

        test('currentElement should not be parent', () => {
            expect(child).not.toBe(parent);
        });
    });
});

describe('endElement', () => {
    describe('given no elements are pushed', () => {
        test('should error', () => {
            expect(instance.endElement).toThrow();
        });
    });

    describe('given elements are pushed', () => {
        let parent: UiElement | undefined;

        beforeEach(() => {
            instance.setCurrentLayer({
                key: 'adifferentlayer',
                zIndex: -1,
            });

            instance.beginElement('parent');
            parent = instance.getCurrentElement();
            instance.beginElement('child');

            instance.endElement();
        });

        test('currentElement should be parent', () => {
            expect(instance.getCurrentElement()).toBe(parent);
        });
    });
});

describe('onPostRender', () => {
    describe('given endElement and beginElement calls are imbalanced', () => {
        beforeEach(() => {
            instance.setCurrentLayer({
                key: 'somelayer',
                zIndex: -1,
            });

            instance.beginElement('foo');
        });

        test('should error', () => {
            expect(instance.onPostRender).toThrow();
        });
    });

    describe('given all elements are properly ended', () => {
        let elements: (UiElement | undefined)[];

        beforeEach(() => {
            instance.setCurrentLayer({
                key: 'somelayer',
                zIndex: -1,
            });

            elements = [];

            instance.beginElement('foo');
            elements.push(instance.getCurrentElement());
            instance.beginElement('foo/bar');
            elements.push(instance.getCurrentElement());
            instance.beginElement('foo/bar/baz');
            elements.push(instance.getCurrentElement());
            instance.endElement();
            instance.beginElement('foo/bar/bing');
            elements.push(instance.getCurrentElement());
            instance.endElement();
            instance.endElement();
            instance.endElement();
            instance.beginElement('fuu');
            elements.push(instance.getCurrentElement());
            instance.beginElement('fuu/bor');
            elements.push(instance.getCurrentElement());
            instance.endElement();
            instance.endElement();

            for (const element of elements) {
                element && element.drawBuffer.push({
                    native: true,
                    command: 'rect',
                    args: [0, 0, 1, 2],
                });
            }

            instance.onPostRender();
        });

        describe('all elements created this frame', () => {
            test('should set their "parent" property to undefined', () => {
                for (const element of elements) {
                    if (!element) { throw new Error('element is undefined'); }
                    expect(element.parent).toBeUndefined();
                }
            });

            test('should set their "drawBuffer" array length to 0', () => {
                for (const element of elements) {
                    if (!element) { throw new Error('element is undefined'); }
                    expect(element.drawBuffer.length).toBe(0);
                }
            });

            test('should set their "children" array length to 0', () => {
                for (const element of elements) {
                    if (!element) { throw new Error('element is undefined'); }
                    expect(element.children.length).toBe(0);
                }
            });

            test("should pass each element into objectPool's release method", () => {
                for (const element of elements) {
                    if (!element) { throw new Error('element is undefined'); }
                    expect(pool.release).toHaveBeenCalledWith(element);
                }
            });
        });
    });
});

