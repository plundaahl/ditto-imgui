import { UiElement } from '../UiElement';

function createFakeCanvasRenderingContext(): CanvasRenderingContext2D {
    return {} as CanvasRenderingContext2D;
}

function createUiElement(...children: UiElement[]) {
    const element = new UiElement(createFakeCanvasRenderingContext);
    element.children.push(...children);
    return element;
}

function createUiElementWithZIndex(index: number) {
    let e = createUiElement();
    e.zIndex = index;
    return e;
}

describe('reset()', () => {
    let instance: UiElement;

    beforeEach(() => {
        instance = createUiElement();
    });

    test('Clears out children', () => {
        instance.children.push(createUiElement());
        UiElement.reset(instance);
        expect(instance.children.length).toBe(0);
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

describe('sortChildrenByZIndex()', () => {
    let instance: UiElement;

    beforeEach(() => {
        instance = createUiElement();
    });

    test('elements are sorted by zIndex, low-to-high', () => {
        const e1 = createUiElementWithZIndex(5);
        const e2 = createUiElementWithZIndex(2);
        const e3 = createUiElementWithZIndex(7);
        const e4 = createUiElementWithZIndex(1);
        const e5 = createUiElementWithZIndex(4);

        const expectedOrder: UiElement[] = [e4, e2, e5, e1, e3];

        instance.children.push(e1, e2, e3, e4, e5);
        instance.sortChildrenByZIndex();

        for (let i = 0; i < instance.children.length; i++) {
            expect(instance.children[i]).toBe(expectedOrder[i]);
        }
    });

    test('elements with identical zIndex have their order preserved', () => {
        const e1 = createUiElementWithZIndex(5);
        const e2 = createUiElementWithZIndex(2);
        const e3 = createUiElementWithZIndex(2);
        const e4 = createUiElementWithZIndex(1);
        const e5 = createUiElementWithZIndex(2);

        const expectedOrder: UiElement[] = [e4, e2, e3, e5, e1];

        instance.children.push(e1, e2, e3, e4, e5);
        instance.sortChildrenByZIndex();

        for (let i = 0; i < instance.children.length; i++) {
            expect(instance.children[i]).toBe(expectedOrder[i]);
        }
    });
});

