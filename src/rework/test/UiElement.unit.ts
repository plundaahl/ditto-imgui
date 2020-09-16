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

describe('forEachDfs()', () => {
    let instance: UiElement;
    let children: UiElement[];

    beforeEach(() => {
        instance = createUiElement();
        children = [];
    });

    type TestElementDef = { children: TestElementDef[] };

    function buildChildrenFromDef(...defs: TestElementDef[]) {
        const recurse = (e: TestElementDef) => {
            const element = createUiElement();
            children.push(element);
            element.children.push(...e.children.map(childDef => recurse(childDef)));
            return element;
        }

        instance.children.push(...defs.map(recurse));
    }

    test('onPreOrder should be called equal to total number of elements', () => {
        buildChildrenFromDef(
            { children: [] },
            { children: [
                { children: [] },
                { children: [] },
                { children: [
                    { children: [] },
                ] },
                { children: [] },
            ] },
            { children: [] },
            { children: [] },
        );

        const allElements: UiElement[] = [ instance, ...children ];
        const onPreOrder = jest.fn();

        instance.forEachDfs(onPreOrder);

        expect(onPreOrder).toHaveBeenCalledTimes(allElements.length);
    });

    test('visit every element', () => {

        let elements: UiElement[] = [ instance, ...children ];
        const nElements = elements.length;
        const output: UiElement[] = [];

        instance.forEachDfs((e) => output.push(e));

        expect(output.length).toEqual(nElements);
        for (let i = 0; i < elements.length; i++) {
            expect(output[i]).toBe(elements[i]);
        }
    });


    test('can rearrange children in callback before iterating through them', () => {
        const parent = instance;

        buildChildrenFromDef(
            { children: [] },
            { children: [] },
            { children: [] },
            { children: [] },
        );

        const expectedOrder = [ parent, ...children.reverse() ];
        let output: UiElement[] = [];

        instance.forEachDfs((e) => {
            const [ ...children ] = e.children;
            e.children.length = 0;
            e.children.push(...children.reverse());
            output.push(e)
        });

        expect(output.length).toEqual(expectedOrder.length);
        for (let i = 0; i < output.length; i++) {
            expect(output[i]).toBe(expectedOrder[i]);
        }
    });
});

