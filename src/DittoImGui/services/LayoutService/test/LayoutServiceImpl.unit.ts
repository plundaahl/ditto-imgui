import { Layer, UiElement } from '../../../types';
import { LayoutFunction, LayoutService } from '../LayoutService';
import { LayoutServiceImpl } from '../LayoutServiceImpl';

let defaultLayoutFn: LayoutFunction;
let instance: LayoutService;
let defaultLayer: Layer;

beforeEach(() => {
    defaultLayer = createLayer();
    defaultLayoutFn = jest.fn();
    instance = new LayoutServiceImpl(defaultLayoutFn);
});

describe('onBeginElement', () => {
    let element: UiElement;

    describe('given no elements were previously pushed', () => {
        beforeEach(() => element = createElement());

        test('should not run layout function', () => {
            instance.onBeginElement(element);
            expect(defaultLayoutFn).not.toHaveBeenCalled();
        });
    });

    describe('given parent and element are on different layers', () => {
        beforeEach(() => {
            element = createElement({ layer: createLayer({ key: 'bar' }) });
            const parent = createElement({}, element);
            const grandparent = createElement({}, parent);

            instance.onBeginElement(parent);
            instance.onBeginElement(grandparent);

            jest.clearAllMocks();
        });

        test('should not run layout function', () => {
            expect(defaultLayoutFn).not.toHaveBeenCalled();
        });
    });

    describe('given several elements were previously pushed', () => {
        beforeEach(() => {
            element = createElement({ key: 'element' });
            const sibling = createElement({ key: 'sibling' });
            const parent = createElement(
                { key: 'parent' },
                sibling,
                element,
            );
            const root = createElement({ key: 'root' }, parent);

            instance.onBeginElement(root);
            instance.onBeginElement(parent);
            instance.onBeginElement(sibling);
            instance.onEndElement();
            jest.clearAllMocks();
        });

        test("should pass its parent into defaultLayoutFn", () => {
            instance.onBeginElement(element);
            expect(defaultLayoutFn).toHaveBeenCalledWith(element.parent);
        });
    });
});

describe('setLayout', () => {
    let parent: UiElement;
    let child: UiElement;
    let customLayoutFn: LayoutFunction;

    beforeEach(() => {
        customLayoutFn = jest.fn();
        child = createElement();
        parent = createElement({}, child);

        instance.onBeginElement(parent);
    });

    describe('given setLayout has been called for an element', () => {
        beforeEach(() => instance.setLayout(customLayoutFn));

        describe('when a child is added on same layer', () => {
            beforeEach(() => instance.onBeginElement(child));

            test('The default layout function should not be called', () => {
                expect(defaultLayoutFn).not.toHaveBeenCalled();
            });

            test('The new layout function should be called', () => {
                expect(customLayoutFn).toHaveBeenCalled();
            });
        });

        describe('when it is called a second time for the same element', () => {
            test('then it should error', () => {
                expect(() => { instance.setLayout(jest.fn()); }).toThrow();
            });
        });
    });

    describe('given setLayout has not been called for an element', () => {
        describe('when a child is added on same layer', () => {
            beforeEach(() => instance.onBeginElement(child));

            test('The default layout function should be called', () => {
                expect(defaultLayoutFn).toHaveBeenCalled();
            });
        });
    });
});

describe('onPostRender', () => {
    let parent: UiElement;
    let child: UiElement;
    let customLayoutFn: LayoutFunction;

    beforeEach(() => {
        customLayoutFn = jest.fn();
        child = createElement();
        parent = createElement({}, child);

        instance.onBeginElement(parent);
    });

    describe('given custom layout was set for an element before onPostRender', () => {
        beforeEach(() => {
            instance.setLayout(customLayoutFn);
            instance.onEndElement();
            instance.onPostRender();
        });

        describe('when that element is added again', () => {
            beforeEach(() => { instance.onBeginElement(parent); });

            test('calling setLayout again should not error', () => {
                expect(() => instance.setLayout(customLayoutFn)).not.toThrow();
            });
        });
    });

    describe('given element stack is not empty', () => {
        test('should error', () => {
            expect(instance.onPostRender).toThrow();
        });
    });
});

function createLayer(overrides: Partial<Layer> = {}): Layer {
    return {
        key: 'foo',
        zIndex: 0,
        ...overrides,
    };
}

function createElement(
    overrides: Partial<UiElement> = {},
    ...children: UiElement[]
): UiElement {
    const parent: UiElement = {
        key: 'foo',
        children: [],
        drawBuffer: [],
        layer: defaultLayer,
        bounds: { x: 0, y: 0, w: 0, h: 0 },
        flags: 0,
        ...overrides,
    };

    for (const child of children) {
        parent.children.push(child);
        child.parent = parent;
    }

    return parent;
}
