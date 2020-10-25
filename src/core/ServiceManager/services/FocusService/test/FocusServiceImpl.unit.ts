import { Layer, UiElement } from '../../../../types';
import { FocusAction, NextFocusAction, PrevFocusAction } from '../FocusAction';
import { InspectableFocusServiceImpl } from './InspectableFocusServiceImpl';

let instance: InspectableFocusServiceImpl;
beforeEach(() => {
    instance = new InspectableFocusServiceImpl();
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

describe('onPreRender', () => {
    describe('given an element is active', () => {
        beforeEach(() => {
            instance.onBeginElement(createElement({ key: 'doesnotmatter' }));
        });

        test('should error', () => {
            expect(instance.onPreRender).toThrow();
        });
    });

    describe('given no element is active', () => {
        beforeEach(() => {
            // prev frame
            instance.onBeginElement(createElement({ key: 'foo' }));
            instance.setFocusable();
            instance.focusElement(); // sets the current element's focus
            instance.onEndElement();
            instance.onPreRender();

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
            expect(instance.onPreRender).not.toThrow();
        });

        test('should empty focusableElements', () => {
            instance.onPreRender();
            expect(instance.getFocusableElements.length).toBe(0);
        });

        describe('given no new focus events have been triggered', () => {
            test('then previously-focused element should be focused', () => {
                instance.onPreRender();
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
                instance.onPreRender();
                expect(instance.getCurrentlyFocusedElement()).toBe('bizzle');
            });
        });

        describe('given a FocusAction was activated last frame', () => {
            beforeEach(() => instance.incrementFocus());
            
            test('should unset action', () => {
                instance.onPreRender();
                expect(instance.getAction()).toBe(undefined);
            });

            test("should call the action's onPreRender() function", () => {
                const action = instance.getAction() as FocusAction;
                action.onPreRender = jest.fn(action.onPreRender);
                instance.onPreRender();
                expect(action.onPreRender).toHaveBeenCalled();
            });
        });
    });

    describe('given an element was focused', () => {
        beforeEach(() => {
            instance.onBeginElement(createElement({ key: 'foo' }));
            instance.setFocusable();
            instance.onEndElement();

            instance.onBeginElement(createElement({ key: 'bar' }));
            instance.setFocusable();
            instance.focusElement();
            instance.onEndElement();

            instance.onPreRender();
        });

        describe('and that element is not rendered this frame', () => {
            beforeEach(() => {
                instance.onBeginElement(createElement({ key: 'foo' }));
                instance.setFocusable();
                instance.onEndElement();

                instance.onPreRender();
            });

            test('focused element should be set to undefined', () => {
                expect(instance.getCurrentlyFocusedElement()).toBe(undefined);
            });
        });

        describe('and that element is rendered this frame', () => {
            beforeEach(() => {
                instance.onBeginElement(createElement({ key: 'foo' }));
                instance.setFocusable();
                instance.onEndElement();

                instance.onBeginElement(createElement({ key: 'bar' }));
                instance.setFocusable();
                instance.focusElement();
                instance.onEndElement();

                instance.onPreRender();
            });

            test('focused element should be set to undefined', () => {
                expect(instance.getCurrentlyFocusedElement()).toBe('bar');
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
                instance.onPreRender();
                instance.onBeginElement(element);
                instance.setFocusable();
                expect(instance.isElementFocused()).toBe(true);
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
            const focusableKeys = instance.getFocusableElements().map(e => e.key);
            expect(focusableKeys.includes(key)).toBe(true);
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

describe('isElementFocused', () => {
    describe('given no element is active', () => {
        test('should error', () => {
            expect(instance.isElementFocused).toThrow();
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
                expect(instance.isElementFocused).toThrow();
            });
        });
        
        describe('and element is focusable', () => {
            beforeEach(() => instance.setFocusable());

            test('should not error', () => {
                expect(instance.isElementFocused).not.toThrow();
            });
        });
    });
});

describe('isChildFocused and isFloatingChildFocused', () => {
    describe('given child is not focused', () => {
        beforeEach(() => {
            const parent = createElement({ key: 'foo'});
            const child = createElement({
                key: 'bar',
                parent: parent,
            });
            parent.children.push(child);

            instance.onBeginElement(parent);
            instance.setFocusable();
            instance.onBeginElement(child);
            instance.setFocusable();
            instance.onEndElement();
            instance.onEndElement();

            instance.onPreRender();
        });

        test('isChildFocused should return false', () => {
            instance.onBeginElement(createElement({ key: 'foo'}));
            instance.setFocusable();
            expect(instance.isChildFocused()).toBe(false);
        });

        test('isFloatingChildFocused should return false', () => {
            instance.onBeginElement(createElement({ key: 'foo'}));
            instance.setFocusable();
            expect(instance.isFloatingChildFocused()).toBe(false);
        });
    });

    describe('given element is focused', () => {
        beforeEach(() => {
            const parent = createElement({ key: 'foo'});
            const child = createElement({
                key: 'bar',
                parent: parent,
            });
            parent.children.push(child);

            instance.onBeginElement(parent);
            instance.setFocusable();
            instance.focusElement();
            instance.onBeginElement(child);
            instance.setFocusable();
            instance.onEndElement();
            instance.onEndElement();

            instance.onPreRender();
        });

        test('isChildFocused should return false', () => {
            instance.onBeginElement(createElement({ key: 'foo'}));
            instance.setFocusable();
            expect(instance.isChildFocused()).toBe(false);
        });

        test('isFloatingChildFocused should return false', () => {
            instance.onBeginElement(createElement({ key: 'foo'}));
            instance.setFocusable();
            expect(instance.isFloatingChildFocused()).toBe(false);
        });
    });

    describe('given child is focused', () => {
        beforeEach(() => {
            const parent = createElement({ key: 'foo'});
            const child = createElement({
                key: 'bar',
                parent: parent,
            });
            parent.children.push(child);

            instance.onBeginElement(parent);
            instance.setFocusable();
            instance.onBeginElement(child);
            instance.setFocusable();

            instance.focusElement();

            instance.onEndElement();
            instance.onEndElement();

            instance.onPreRender();
        });

        test('isChildFocused should return true', () => {
            instance.onBeginElement(createElement({ key: 'foo'}));
            instance.setFocusable();
            expect(instance.isChildFocused()).toBe(true);
        });

        test('isFloatingChildFocused should return false', () => {
            instance.onBeginElement(createElement({ key: 'foo'}));
            instance.setFocusable();
            expect(instance.isFloatingChildFocused()).toBe(false);
        });
    });

    describe('given child is focused, but on different layer', () => {
        beforeEach(() => {
            const parent = createElement({ key: 'foo'});
            const child = createElement({
                key: 'bar',
                parent: parent,
                layer: createLayer({ key: 'other' }),
            });
            parent.children.push(child);

            instance.onBeginElement(parent);
            instance.setFocusable();
            
            instance.onBeginElement(child);
            instance.setFocusable();
            instance.focusElement();
            instance.onEndElement();

            instance.onEndElement();

            instance.onPreRender();
        });

        test('isChildFocused should return false', () => {
            instance.onBeginElement(createElement({ key: 'foo'}));
            instance.setFocusable();
            expect(instance.isChildFocused()).toBe(false);
        });

        test('isFloatingChildFocused should return true', () => {
            instance.onBeginElement(createElement({ key: 'foo'}));
            instance.setFocusable();
            expect(instance.isFloatingChildFocused()).toBe(true);
        });
    });
});

describe('didFocusChange', () => {
    describe('given an element was focused last frame', () => {
        beforeEach(() => {
            instance.onBeginElement(createElement({ key: 'foo' }));
            instance.setFocusable();
            instance.focusElement();
            instance.onEndElement(); 
            instance.onPreRender();
        });

        describe('and the same element is focused this frame', () => {
            beforeEach(() => {
                instance.onBeginElement(createElement({ key: 'foo' }));
                instance.setFocusable();
                instance.focusElement();
                instance.onEndElement(); 
                instance.onPreRender();
            });

            test('should return false', () => {
                expect(instance.didFocusChange()).toBe(false);
            });
        });

        describe('and a different element is focused this frame', () => {
            beforeEach(() => {
                instance.onBeginElement(createElement({ key: 'bar' }));
                instance.setFocusable();
                instance.focusElement();
                instance.onEndElement(); 
                instance.onPreRender();
            });

            test('should return true', () => {
                expect(instance.didFocusChange()).toBe(true);
            });
        });

        describe('and the element is not focused this frame', () => {
            beforeEach(() => {
                instance.onBeginElement(createElement({ key: 'bar' }));
                instance.setFocusable();
                instance.onEndElement(); 
                instance.onPreRender();
            });

            test('should return true', () => {
                expect(instance.didFocusChange()).toBe(true);
            });
        });
    });

    describe('given an element was not focused last frame', () => {
        describe('and an element is focused this frame', () => {
            beforeEach(() => {
                instance.onBeginElement(createElement({ key: 'foo' }));
                instance.setFocusable();
                instance.focusElement();
                instance.onEndElement(); 
                instance.onPreRender();
            });

            test('should return true', () => {
                expect(instance.didFocusChange()).toBe(true);
            });
        });

        describe('and no element is focused this frame', () => {
            test('should return true', () => {
                expect(instance.didFocusChange()).toBe(false);
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
