import { UiElement } from '../UiElement';

function createFakeCanvasRenderingContext(): CanvasRenderingContext2D {
    return {} as CanvasRenderingContext2D;
}

function createUiElement() {
    return new UiElement(createFakeCanvasRenderingContext);
}

describe('reset()', () => {
    let instance: UiElement;

    beforeEach(() => {
        instance = new UiElement(createFakeCanvasRenderingContext)
    });

    test('Clears out children', () => {
        instance.children.push(createUiElement());
        UiElement.reset(instance);
        expect(instance.children.length).toBe(0);
    });

    test('Clears out floatingChildren', () => {
        instance.floatingChildren.push(createUiElement());
        UiElement.reset(instance);
        expect(instance.floatingChildren.length).toBe(0);
    });

    test('Deletes key', () => {
        instance.key = "yoyoyo";
        UiElement.reset(instance);
        expect(instance.key).toBeUndefined();
    });

    test('Sets zIndex to 0', () => {
        instance.zIndex = 33;
        UiElement.reset(instance);
        expect(instance.zIndex).toBe(0);
    });

    test('Resets onBeginChild', () => {
        const fn = jest.fn();
        instance.onBeginChild = fn;
        UiElement.reset(instance);
        expect(instance.onBeginChild).not.toBe(fn);
    });

    test('Resets onEndChild', () => {
        const fn = jest.fn();
        instance.onEndChild = fn;
        UiElement.reset(instance);
        expect(instance.onEndChild).not.toBe(fn);
    });
});

