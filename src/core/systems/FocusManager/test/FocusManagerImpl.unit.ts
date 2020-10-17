import { Layer, UiElement } from '../../../types';
import { FocusAction, NextFocusAction, PrevFocusAction } from '../FocusAction';
import { InspectableFocusManagerImpl } from './InspectableFocusManagerImpl';

let instance: InspectableFocusManagerImpl;
beforeEach(() => {
    instance = new InspectableFocusManagerImpl();
});

describe('onBeginElement', () => {
    test('Should set current element to most-recently-pushed element', () => {
        instance.onBeginElement(createElement());
        instance.onBeginElement(createElement());
        const element = createElement();
        instance.onBeginElement(element);
        expect(instance.getCurrentElement()).toBe(element);
    });
});

describe('onEndElement', () => {
    test('Should set current element to previously-pushed element', () => {
        const element = createElement();
        instance.onBeginElement(element);

        instance.onBeginElement(createElement());
        instance.onEndElement();

        expect(instance.getCurrentElement()).toBe(element);
    });
});

describe('onPostRender', () => {
    describe('given an element is active', () => {
        beforeEach(() => {
            instance.onBeginElement(createElement({ key: 'doesnotmatter' }));
        });

        test('should error', () => {
            expect(instance.onPostRender).toThrow();
        });
    });

    describe('given no element is active', () => {
        beforeEach(() => {
            // prev frame
            instance.onBeginElement(createElement({ key: 'foo' }));
            instance.setFocusable();
            instance.focusElement(); // sets the current element's focus
            instance.onEndElement();
            instance.onPostRender();

            // current frame
            instance.onBeginElement(createElement({ key: 'foo' }));
            instance.setFocusable();
            instance.onEndElement();
            instance.onBeginElement(createElement({ key: 'bar' }));
            instance.setFocusable();
            instance.onBeginElement(createElement({ key: 'baz' }));
            instance.setFocusable();
            instance.onBeginElement(createElement({ key: 'bing' }));
            instance.setFocusable();
            instance.onEndElement();
            instance.onEndElement();
            instance.onEndElement();
        });

        test('should not error', () => {
            expect(instance.onPostRender).not.toThrow();
        });

        test('should empty focusableElements', () => {
            instance.onPostRender();
            expect(instance.getFocusableElements.length).toBe(0);
        });

        describe('given no new focus events have been triggered', () => {
            test('then previously-focused element should be focused', () => {
                instance.onPostRender();
                expect(instance.getCurrentlyFocusedElement()).toBe('foo');
            });
        });

        describe('given focusElement() was called during last frame', () => {
            beforeEach(() => {
                instance.onBeginElement(createElement({ key: 'bizzle' }));
                instance.setFocusable();
                instance.focusElement();
                instance.onEndElement();
            });

            test('should update currently-focused element', () => {
                instance.onPostRender();
                expect(instance.getCurrentlyFocusedElement()).toBe('bizzle');
            });
        });

        describe('given a FocusAction was activated last frame', () => {
            beforeEach(() => instance.incrementFocus());
            
            test('should unset action', () => {
                instance.onPostRender();
                expect(instance.getAction()).toBe(undefined);
            });

            test("should call the action's onPostRender() function", () => {
                const action = instance.getAction() as FocusAction;
                action.onPostRender = jest.fn(action.onPostRender);
                instance.onPostRender();
                expect(action.onPostRender).toHaveBeenCalled();
            });
        });
    });
});

describe('focusElement', () => {
    describe('given there is no current element', () => {
        test('should error', () => {
            expect(instance.focusElement).toThrow();
        });
    });

    describe('given there is a current element', () => {
        const key = 'testkey';
        let element: UiElement;

        beforeEach(() => {
            element = createElement({ key });
            instance.onBeginElement(element);
        });

        describe('and current element has not been set to focusable', () => {
            test('should error', () => {
                expect(instance.focusElement).toThrow();
            });
        });

        describe('and current element has been set to focusable', () => {
            beforeEach(() => instance.setFocusable());

            test('should not error', () => {
                expect(instance.focusElement).not.toThrow();
            });

            test('should focus on that element next frame', () => {
                instance.focusElement();
                instance.onEndElement();
                instance.onPostRender();
                instance.onBeginElement(element);
                instance.setFocusable();
                expect(instance.isFocused()).toBe(true);
            });
        });
    });
});

describe('incrementFocus', () => {
    beforeEach(() => {
        instance.onBeginElement(createElement());
        instance.setFocusable();
    });

    test('should set action to NextFocusAction', () => {
        instance.incrementFocus();
        expect(instance.getAction()).toBeInstanceOf(NextFocusAction);
    });
});

describe('decrementFocus', () => {
    beforeEach(() => {
        instance.onBeginElement(createElement());
        instance.setFocusable();
    });

    test('should set action to NextFocusAction', () => {
        instance.decrementFocus();
        expect(instance.getAction()).toBeInstanceOf(PrevFocusAction);
    });
});

describe('setFocusable', () => {
    describe('given there is no current element', () => {
        test('should error', () => {
            expect(instance.setFocusable).toThrow();
        });
    });

    describe('given there is currently an element', () => {
        const key = 'testkey';

        beforeEach(() => {
            instance.onBeginElement(createElement({ key }));
        });

        test("Should add current element key to focusableElements", () => {
            instance.setFocusable();
            expect(instance.getFocusableElements().includes(key)).toBe(true);
        });

        describe('given an action has been triggered', () => {
            beforeEach(() => instance.incrementFocus());

            test("should call that action's onSetFocus() function", () => {
                const action = instance.getAction() as FocusAction;
                action.onSetFocusable = jest.fn(action.onSetFocusable);
                instance.setFocusable();

                expect(action.onSetFocusable).toHaveBeenCalled();
            });
        });
    });
});

describe('isFocused', () => {
    describe('given no element is active', () => {
        test('should error', () => {
            expect(instance.isFocused).toThrow();
        });
    });

    describe('given an element is active', () => {
        const key = 'foo/bar/baz';
        let element: UiElement;

        beforeEach(() => {
            element = createElement({ key });
            instance.onBeginElement(element);
        });

        describe('and element is not focusable', () => {
            test('should error', () => {
                expect(instance.isFocused).toThrow();
            });
        });
        
        describe('and element is focusable', () => {
            beforeEach(() => instance.setFocusable());

            test('should not error', () => {
                expect(instance.isFocused).not.toThrow();
            });
        });
    });
});

function createLayer(layer: Partial<Layer> = {}): Layer {
    return {
        key: 'foo',
        zIndex: 0,
        ...layer,
    };
}

function createElement(element: Partial<UiElement> = {}): UiElement {
    return {
        key: 'foo',
        bounds: { x: 0, y: 0, w: 0, h: 0 },
        children: [],
        drawBuffer: [],
        layer: createLayer(),
        ...element,
    };
}
