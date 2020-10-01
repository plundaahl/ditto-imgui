import { InspectableMouseHandlerImpl } from './InspectableMouseHandlerImpl';
import { MouseWatcher, MouseAction } from '../MouseWatcher';
import { UiElement, Layer } from '../../../types';

let mouseHandler: InspectableMouseHandlerImpl;
let mouseWatcher: MouseWatcher;

beforeEach(() => {
    mouseWatcher = {
        posX: 0,
        posY: 0,
        dragX: 0,
        dragY: 0,
        isOverCanvas: true,
        m1Down: false,
        m2Down: false,
        action: MouseAction.NONE,
    };
    mouseHandler = new InspectableMouseHandlerImpl(mouseWatcher);
});

describe('dragX', () => {
    test('should return mouseWatcher.dragX', () => {
        mouseWatcher.dragX = 32;
        expect(mouseHandler.dragX).toBe(mouseWatcher.dragX);
    });
});

describe('dragY', () => {
    test('should return mouseWatcher.dragY', () => {
        mouseWatcher.dragY = 32;
        expect(mouseHandler.dragY).toBe(mouseWatcher.dragY);
    });
});

describe('onBeginElement', () => {
    let element: UiElement;

    beforeEach(() => {
        element = createElement();
        mouseHandler.onBeginElement(element);
    });

    test('should push new element onto internal buildStack', () => {
        expect(mouseHandler.getBuildStack().length).toBe(1);
        expect(mouseHandler.getBuildStack()[0]).toBe(element);
    });
});

describe('onEndElement', () => {
    let elements: UiElement[];

    beforeEach(() => {
        elements = [
            createElement(),
            createElement(),
        ];

        let prevElement: UiElement | undefined;
        for (const element of elements) {
            mouseHandler.onBeginElement(element);
            if (prevElement) {
                prevElement.children.push(element);
                element.parent = prevElement;
            }
            prevElement = element;
        }
    });

    test('should pop last element off stack', () => {
        mouseHandler.onEndElement();
        expect(mouseHandler.getBuildStack().length).toBe(1);
        expect(mouseHandler.getBuildStack()[0]).toBe(elements[0]);
    });

    describe('given mouse was hovering over popped element', () => {
        beforeEach(() => {
            mouseWatcher.posX = 25;
            mouseWatcher.posY = 25;
        });

        describe("and element's child was not under mouse", () => {
            beforeEach(() => {
                elements[1].bounds.x = 50;
                elements[1].bounds.y = 50;
                mouseHandler.onEndElement();
                mouseHandler.onEndElement();
            });

            test('should add element to hoverCandidates pool', () => {
                expect(mouseHandler.getHoverCandidates().includes(elements[0]))
                    .toBe(true);
            });
        });

        describe("and element's child was under mouse", () => {
            describe("and element's child was on same layer", () => {
                beforeEach(() => {
                    mouseHandler.onEndElement();
                });

                test('should not add element to hoverCandidates pool', () => {
                    mouseHandler.onEndElement();
                    expect(mouseHandler.getHoverCandidates().includes(elements[0]))
                        .toBe(false);
                });
            });

            describe("and element's child was on different layer", () => {
                beforeEach(() => {
                    elements[1].layer = { key: 'someotherlayer', zIndex: 2 };
                    mouseHandler.onEndElement();
                });

                test('should add element to hoverCandidates pool', () => {
                    mouseHandler.onEndElement();
                    expect(mouseHandler.getHoverCandidates().includes(elements[0]))
                        .toBe(true);
                });
            });
        });
    });
});

describe('onLayersSorted', () => {
    describe('given no candidates', () => {
        beforeEach(() => {
            mouseWatcher.posX = 50;
            mouseWatcher.posY = 50;
            mouseHandler.onLayersSorted();
        });

        test('should select candidate on layer with highest zIndex', () => {
            expect(mouseHandler.getHoveredElementKey()).toBeUndefined();
        });
    });

    describe('given several candidates', () => {
        let elements: UiElement[];

        beforeEach(() => {
            mouseWatcher.posX = 50;
            mouseWatcher.posY = 50;
            
            const layers: Layer[] = [
                { key: 'foo', zIndex: 0 },
                { key: 'bar', zIndex: 6 },
                { key: 'baz', zIndex: 3 },
            ];

            elements = [
                createElement({ key: 'foo', layer: layers[0] }),
                createElement({ key: 'bob', layer: layers[1] }),
                createElement({ key: 'bar', layer: layers[1] }),
                createElement({ key: 'baz', layer: layers[2] }),
                createElement({ key: 'bing', layer: layers[2] }),
            ];

            let parent: UiElement | undefined;
            for (const element of elements) {
                if (parent) {
                    parent.children.push(element);
                    element.parent = parent;
                }
                parent = element;
            }

            for (const element of elements) {
                mouseHandler.onBeginElement(element);
            }

            for (const _ of elements) {
                mouseHandler.onEndElement();
            }

            mouseWatcher.action = MouseAction.CLICK;
            mouseWatcher.dragX = 52;
            mouseWatcher.dragY = -93;

            mouseHandler.onLayersSorted();
        });

        test('should select candidate on layer with highest zIndex', () => {
            expect(mouseHandler.getHoveredElementKey()).toBe('bar');
        });

        test('should mark parents on same layer for hoveredChild', () => {
            expect(mouseHandler.getHoveredElementParents().includes('bob'))
                .toBe(true);
        });

        test('should not mark parents on different layers for hoveredChild', () => {
            expect(mouseHandler.getHoveredElementParents().includes('foo'))
                .toBe(false);
        });

        test('should mark parents on different layer for hoveredFloatChild', () => {
            expect(mouseHandler.getFloatHoveredElementParents().includes('foo'))
                .toBe(true);
        });

        test('should not mark parents on different layers as hoveredFLoatChild', () => {
            expect(mouseHandler.getFloatHoveredElementParents().includes('bob'))
                .toBe(false);
        });

        test('should empty hoverCandidates array', () => {
            expect(mouseHandler.getHoverCandidates().length).toBe(0);
        });

        test('should empty parentsOfCandidates', () => {
            expect(mouseHandler.getParentsOfCandidates().size).toBe(0);
        });

        test('should reset watcher.action if not drag', () => {
            expect(mouseWatcher.action).toBe(MouseAction.NONE);
        });

        test('should not reset watcher.action if drag', () => {
            mouseWatcher.action = MouseAction.DRAG;
            mouseHandler.onLayersSorted();
            expect(mouseWatcher.action).toBe(MouseAction.DRAG);
        });

        test('should reset watcher.dragX and dragY', () => {
            expect(mouseWatcher.dragX).toBe(0);
            expect(mouseWatcher.dragY).toBe(0);
        });
    });

    describe('given unfinished buildStack', () => {
        beforeEach(() => {
            mouseHandler.onBeginElement(createElement());
        });

        test('should error', () => {
            expect(mouseHandler.onLayersSorted).toThrow();
        });
    });
});

describe('hoversElement', () => {
    describe('given no element was hovered last frame', () => {
        beforeEach(() => {
            mouseHandler.onLayersSorted();
            mouseHandler.onBeginElement(createElement());
        });

        test('should return false', () => {
            expect(mouseHandler.hoversElement()).toBe(false);
        });
    });

    describe('given another element was hovered last frame', () => {
        beforeEach(() => {
            mouseHandler.onBeginElement(createElement({ key: 'otherelement' }));
            mouseHandler.onEndElement();
            mouseHandler.onLayersSorted();
            mouseHandler.onBeginElement(createElement());
        });

        test('should return false', () => {
            expect(mouseHandler.hoversElement()).toBe(false);
        });
    });

    describe('given element with same key was hovered last frame', () => {
        beforeEach(() => {
            mouseHandler.onBeginElement(createElement({ key: 'sameelement' }));
            mouseHandler.onEndElement();
            mouseHandler.onLayersSorted();
            mouseHandler.onBeginElement(createElement({ key: 'sameelement' }));
        });

        test('should return true', () => {
            expect(mouseHandler.hoversElement()).toBe(true);
        });
    });
});

describe('hoversChild', () => {
    describe('given no element was hovered last frame', () => {
        beforeEach(() => {
            mouseHandler.onLayersSorted();
            mouseHandler.onBeginElement(createElement());
        });

        test('should return false', () => {
            expect(mouseHandler.hoversChild()).toBe(false);
        });
    });

    describe('given element with same key was hovered last frame', () => {
        beforeEach(() => {
            mouseHandler.onBeginElement(createElement({ key: 'sameelement' }));
            mouseHandler.onEndElement();
            mouseHandler.onLayersSorted();
            mouseHandler.onBeginElement(createElement({ key: 'sameelement' }));
        });

        test('should return false', () => {
            expect(mouseHandler.hoversChild()).toBe(false);
        });
    });

    describe('given child element was hovered last frame', () => {
        beforeEach(() => {
            mouseWatcher.posX = 50;
            mouseWatcher.posY = 50;

            const elements = [
                createElement({ key: 'foo' }),
                createElement({ key: 'foo/bar' }),
                createElement({ key: 'foo/bar/baz' }),
            ];

            let parent: UiElement | undefined;
            for (const element of elements) {
                if (parent) {
                    element.parent = parent;
                    parent.children.push(element);
                }
                parent = element;
            }

            for (const element of elements) {
                mouseHandler.onBeginElement(element);
            }

            for (const _ of elements) {
                mouseHandler.onEndElement();
            }

            mouseHandler.onLayersSorted();
            mouseHandler.onBeginElement(createElement({ key: 'foo' }));
        });

        test('should return true', () => {
            expect(mouseHandler.hoversChild()).toBe(true);
        });
    });

    describe('given child element on different layer was hovered last frame', () => {
        beforeEach(() => {
            mouseWatcher.posX = 50;
            mouseWatcher.posY = 50;

            const elements = [
                createElement({ key: 'foo' }),
                createElement({ key: 'foo/bar' }),
                createElement({
                    key: 'foo/bar/baz',
                    layer: { zIndex: 5, key: 'baz' },
                }),
            ];

            let parent: UiElement | undefined;
            for (const element of elements) {
                if (parent) {
                    element.parent = parent;
                    parent.children.push(element);
                }
                parent = element;
            }

            for (const element of elements) {
                mouseHandler.onBeginElement(element);
            }

            for (const _ of elements) {
                mouseHandler.onEndElement();
            }

            mouseHandler.onLayersSorted();
            mouseHandler.onBeginElement(createElement({ key: 'foo' }));
        });

        test('should return false', () => {
            expect(mouseHandler.hoversChild()).toBe(false);
        });
    });
});

describe('hoversFloatingChild', () => {
    describe('given no element was hovered last frame', () => {
        beforeEach(() => {
            mouseHandler.onLayersSorted();
            mouseHandler.onBeginElement(createElement());
        });

        test('should return false', () => {
            expect(mouseHandler.hoversFloatingChild()).toBe(false);
        });
    });

    describe('given element with same key was hovered last frame', () => {
        beforeEach(() => {
            mouseHandler.onBeginElement(createElement({ key: 'sameelement' }));
            mouseHandler.onEndElement();
            mouseHandler.onLayersSorted();
            mouseHandler.onBeginElement(createElement({ key: 'sameelement' }));
        });

        test('should return false', () => {
            expect(mouseHandler.hoversFloatingChild()).toBe(false);
        });
    });

    describe('given child element on same layer was hovered last frame', () => {
        beforeEach(() => {
            mouseWatcher.posX = 50;
            mouseWatcher.posY = 50;

            const elements = [
                createElement({ key: 'foo' }),
                createElement({ key: 'foo/bar' }),
                createElement({ key: 'foo/bar/baz' }),
            ];

            let parent: UiElement | undefined;
            for (const element of elements) {
                if (parent) {
                    element.parent = parent;
                    parent.children.push(element);
                }
                parent = element;
            }

            for (const element of elements) {
                mouseHandler.onBeginElement(element);
            }

            for (const _ of elements) {
                mouseHandler.onEndElement();
            }

            mouseHandler.onLayersSorted();
            mouseHandler.onBeginElement(createElement({ key: 'foo' }));
        });

        test('should return false', () => {
            expect(mouseHandler.hoversFloatingChild()).toBe(false);
        });
    });

    describe('given child element on different layer was hovered last frame', () => {
        beforeEach(() => {
            mouseWatcher.posX = 50;
            mouseWatcher.posY = 50;

            const elements = [
                createElement({ key: 'foo' }),
                createElement({ key: 'foo/bar' }),
                createElement({
                    key: 'foo/bar/baz',
                    layer: { zIndex: 5, key: 'baz' },
                }),
            ];

            let parent: UiElement | undefined;
            for (const element of elements) {
                if (parent) {
                    element.parent = parent;
                    parent.children.push(element);
                }
                parent = element;
            }

            for (const element of elements) {
                mouseHandler.onBeginElement(element);
            }

            for (const _ of elements) {
                mouseHandler.onEndElement();
            }

            mouseHandler.onLayersSorted();
            mouseHandler.onBeginElement(createElement({ key: 'foo' }));
        });

        test('should return true', () => {
            expect(mouseHandler.hoversFloatingChild()).toBe(true);
        });
    });
});

describe('isM1Down', () => {
    describe('given watcher.m1Down is false', () => {
        beforeEach(() => { mouseWatcher.m1Down = false });

        test('should return false', () => {
            expect(mouseHandler.isM1Down()).toBe(false);
        });
    });

    describe('given watcher.m1Down is true', () => {
        beforeEach(() => { mouseWatcher.m1Down = true });

        test('should return true', () => {
            expect(mouseHandler.isM1Down()).toBe(true);
        });
    });
});

describe('isM2Down', () => {
    describe('given watcher.m2Down is false', () => {
        beforeEach(() => { mouseWatcher.m2Down = false });

        test('should return false', () => {
            expect(mouseHandler.isM2Down()).toBe(false);
        });
    });

    describe('given watcher.m2Down is true', () => {
        beforeEach(() => { mouseWatcher.m2Down = true });

        test('should return true', () => {
            expect(mouseHandler.isM2Down()).toBe(true);
        });
    });
});

describe('isClicked', () => {
    describe('given watcher.action is set to click', () => {
        beforeEach(() => mouseWatcher.action = MouseAction.CLICK);

        test('returns true', () => {
            expect(mouseHandler.isClicked()).toBe(true);
        });
    });

    describe('given watcher.action is not set to click', () => {
        beforeEach(() => mouseWatcher.action = MouseAction.DOUBLE_CLICK);

        test('returns true', () => {
            expect(mouseHandler.isClicked()).toBe(false);
        });
    });
});

describe('isDoubleClicked', () => {
    describe('given watcher.action is set to double-click', () => {
        beforeEach(() => mouseWatcher.action = MouseAction.DOUBLE_CLICK);

        test('returns true', () => {
            expect(mouseHandler.isDoubleClicked()).toBe(true);
        });
    });

    describe('given watcher.action is not set to double-click', () => {
        beforeEach(() => mouseWatcher.action = MouseAction.DRAG);

        test('returns true', () => {
            expect(mouseHandler.isDoubleClicked()).toBe(false);
        });
    });
});

describe('isAuxClicked', () => {
    describe('given watcher.action is set to m2-click', () => {
        beforeEach(() => mouseWatcher.action = MouseAction.M2_CLICK);

        test('returns true', () => {
            expect(mouseHandler.isAuxClicked()).toBe(true);
        });
    });

    describe('given watcher.action is not set to m2-click', () => {
        beforeEach(() => mouseWatcher.action = MouseAction.DRAG);

        test('returns true', () => {
            expect(mouseHandler.isAuxClicked()).toBe(false);
        });
    });
});

describe('isDragged', () => {
    describe('given watcher.action is set to drag', () => {
        beforeEach(() => mouseWatcher.action = MouseAction.DRAG);

        test('returns true', () => {
            expect(mouseHandler.isDragged()).toBe(true);
        });
    });

    describe('given watcher.action is not set to drag', () => {
        beforeEach(() => mouseWatcher.action = MouseAction.CLICK);

        test('returns true', () => {
            expect(mouseHandler.isDragged()).toBe(false);
        });
    });
});

const defaultLayer = { key: 'foo', zIndex: 0 };

function createElement(props: Partial<UiElement> = {}): UiElement {
    return {
        key: 'foo',
        layer: defaultLayer,
        bounds: { x: 0, y: 0, w: 100, h: 100 },
        children: [],
        drawBuffer: [],
        ...props,
    };
}

