import { UiElement, Layer } from '../../../types';
import { ElementFactory } from '../ElementFactory';
import { ElementFactoryImpl } from '../ElementFactoryImpl';

let defaultLayer: Layer;
let instance: ElementFactory;

beforeEach(() => {
    defaultLayer = { key: 'somelayer', zIndex: -1 };
    instance = new ElementFactoryImpl(defaultLayer);
});

describe('createElement', () => { describe('returned element', () => {
        let element: UiElement;
        beforeEach(() => element = instance.createElement());

        test('should have empty key', () => {
            expect(element.key).toBe('');
        });

        test('should have empty drawBuffer', () => {
            expect(element.drawBuffer.length).toBe(0);
        });

        test('should have empty children array', () => {
            expect(element.children.length).toBe(0);
        });

        test('should have undefined parent', () => {
            expect(element.parent).toBeUndefined();
        });
    });
});

describe('resetElement', () => {
    let element: UiElement;

    beforeEach(() => {
        element = instance.createElement();

        element.key = 'somenewkey';
        element.bounds.x = 33;
        element.bounds.y = 20;
        element.bounds.w = 94;
        element.bounds.h = 72;
        element.drawBuffer.push({
            native: true,
            command: 'rect',
            args: [0, 0, 33, 2],
        });
        element.children.push(instance.createElement());
        element.parent = instance.createElement();
        element.layer = { key: 'differentlayer', zIndex: 94 };
        element.flags = 256;

        instance.resetElement(element);
    });

    test("should set element's key to empty string", () => {
        expect(element.key).toBe('');
    });

    test("should delete element's parent property", () => {
        expect(element.parent).toBeUndefined();
    });

    test("should set element's layer to default", () => {
        expect(element.layer).toBe(defaultLayer);
    });

    test("should empty element's children array", () => {
        expect(element.children.length).toBe(0);
    });

    test("should empty element's drawBuffer array", () => {
        expect(element.drawBuffer.length).toBe(0);
    });

    test("should set all element's bounds values to 0", () => {
        expect(element.bounds.x).toBe(0);
        expect(element.bounds.y).toBe(0);
        expect(element.bounds.h).toBe(0);
        expect(element.bounds.w).toBe(0);
    });

    test("should reset flags to 0", () => {
        expect(element.flags).toBe(0);
    });
});

