import { Layer, UiElement } from '../../../types';
import { LayoutService, LayoutFunction } from '../LayoutService';
import { LayoutServiceImpl } from '../LayoutServiceImpl';

let instance: LayoutService;
let defaultLayer: Layer;

beforeEach(() => {
    defaultLayer = createLayer();
    instance = new LayoutServiceImpl();
});

describe('addGlobalConstraints', () => {
    let constraints: LayoutFunction[];
    beforeEach(() => constraints = [jest.fn(), jest.fn(), jest.fn()]);

    describe('Given addGlobalConstraints has been called', () => {
        beforeEach(() => instance.addGlobalConstraints(...constraints));

        describe('And an element is active', () => {
            beforeEach(() => instance.onBeginElement(createElement()));

            describe('When calculateLayout is called', () => {
                beforeEach(() => instance.calculateLayout());

                test('Each constraint should be run', () => {
                    for (const constraint of constraints) {
                        expect(constraint).toHaveBeenCalled();
                    }
                });
            });
        });

        describe('And no element is active', () => {
            test('calculateLayout should error', () => {
                expect(instance.calculateLayout).toThrow();
            });
        });
    });
});

describe('addChildConstraints', () => {
    let constraints: LayoutFunction[];
    beforeEach(() => constraints = [jest.fn(), jest.fn(), jest.fn()]);

    describe('Given an element is active', () => {
        let parent: UiElement;

        beforeEach(() => {
            parent = createElement();
            instance.onBeginElement(parent);
        });

        describe('And addChildConstraints has been called', () => {
            beforeEach(() => instance.addChildConstraints(...constraints));

            describe('And a child is added on same layer', () => {
                beforeEach(() => {
                    const child = createElement({ parent, layer: parent.layer });
                    parent.children.push(child);
                    instance.onBeginElement(child);
                });

                describe('When calculateLayout is called', () => {
                    beforeEach(() => instance.calculateLayout());

                    test('Each constraint should be run', () => {
                        for (const constraint of constraints) {
                            expect(constraint).toHaveBeenCalled();
                        }
                    });
                });
            });

            describe('And a child is added on different layer', () => {
                beforeEach(() => {
                    const child = createElement({ parent, layer: createLayer({ key: 'someotherlayer' }) });
                    parent.children.push(child);
                    instance.onBeginElement(child);
                });

                describe('When calculateLayout is called', () => {
                    beforeEach(() => instance.calculateLayout());

                    test('Child constraints should NOT be run', () => {
                        for (const constraint of constraints) {
                            expect(constraint).not.toHaveBeenCalled();
                        }
                    });
                });
            });
        })
    });

    describe('Given no element is active', () => {
        test('addChildConstraints should error', () => {
            expect(instance.addChildConstraints).toThrow();
        });
    });
});

describe('onBeginElement', () => {
    let element: UiElement;

    describe('given no elements were previously pushed', () => {
        beforeEach(() => element = createElement());
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
