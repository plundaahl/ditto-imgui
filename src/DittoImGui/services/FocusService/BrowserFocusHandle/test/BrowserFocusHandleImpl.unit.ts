import { BrowserFocusHandleImpl } from '../BrowserFocusHandleImpl';
import { BrowserFocusHandle } from '../BrowserFocusHandle';

interface ListenableHtmlElement {
    addEventListener(event: string, fn: (e: Event) => void): void;
}

interface FocusableHtmlElement {
    focus(): void;
    addEventListener(event: string, fn: (e: Event) => void): void;
    setAttribute(attr: string, value: any): void;
    removeAttribute(attr: string): void;
}

interface FunctionDict {
    [key: string] : { (e: Event): void }
}

let rootElement: ListenableHtmlElement;
let tabBackwardsTrap: FocusableHtmlElement;
let tabCenterTrap: FocusableHtmlElement;
let tabForwardsTrap: FocusableHtmlElement;

let rootListeners: FunctionDict;
let tabBackwardsTrapListeners: FunctionDict;
let tabCenterTrapListeners: FunctionDict;
let tabForwardsTrapListeners: FunctionDict;

let onAppBlur: () => void;
let onAppFocus: () => void;

let instance: BrowserFocusHandle;

beforeEach(() => {
    rootListeners = {};
    tabBackwardsTrapListeners = {};
    tabCenterTrapListeners = {};
    tabForwardsTrapListeners = {};

    rootElement = {
        addEventListener: jest.fn((e, fn) => rootListeners[e] = fn)
    };

    tabBackwardsTrap = {
        addEventListener: jest.fn((e, fn) => tabBackwardsTrapListeners[e] = fn),
        focus: jest.fn(),
        setAttribute: jest.fn(),
        removeAttribute: jest.fn(),
    };

    tabCenterTrap = {
        addEventListener: jest.fn((e, fn) => tabCenterTrapListeners[e] = fn),
        focus: jest.fn(),
        setAttribute: jest.fn(),
        removeAttribute: jest.fn(),
    };

    tabForwardsTrap = {
        addEventListener: jest.fn((e, fn) => tabForwardsTrapListeners[e] = fn),
        focus: jest.fn(),
        setAttribute: jest.fn(),
        removeAttribute: jest.fn(),
    };

    instance = new BrowserFocusHandleImpl(
        rootElement,
        tabBackwardsTrap,
        tabCenterTrap,
        tabForwardsTrap,
    );

    onAppFocus = jest.fn();
    onAppBlur = jest.fn();

    instance.onAppFocus(onAppFocus);
    instance.onAppBlur(onAppBlur);
});

describe('root element click handling', () => {
    test('root element onClick listener should have been set up', () => {
        expect(rootElement.addEventListener).toHaveBeenCalled();
    });

    describe('given root element is clicked', () => {
        beforeEach(() => rootListeners['click'](new Event('click')));

        test('should call focus() on center trap', () => {
            expect(tabCenterTrap.focus).toHaveBeenCalled();
        });
    });
});

describe('tabbing forwards', () => {
    test('tabForwardsTrap should have had its focus listener set up', () => {
        expect(tabForwardsTrap.addEventListener).toHaveBeenCalled();
        expect(tabForwardsTrapListeners['focus']).not.toBeUndefined();
    });

    describe('given tabForwardsTrap element is focused', () => {
        beforeEach(() => tabForwardsTrapListeners['focus'](new Event('focus')));

        test('should call focus() on center trap', () => {
            expect(tabCenterTrap.focus).toHaveBeenCalled();
        });
    });
});

describe('tabbing backwards', () => {
    test('tabBackwardsTrap should have had its focus listener set up', () => {
        expect(tabBackwardsTrap.addEventListener).toHaveBeenCalled();
        expect(tabBackwardsTrapListeners['focus']).not.toBeUndefined();
    });

    describe('given tabBackwardsTrap element is focused', () => {
        beforeEach(() => tabBackwardsTrapListeners['focus'](new Event('focus')));

        test('should call focus() on center trap', () => {
            expect(tabCenterTrap.focus).toHaveBeenCalled();
        });
    });
});

describe('focusing on the center trap', () => {
    test('center trap should have had its focus listener set up', () => {
        expect(tabCenterTrap.addEventListener).toHaveBeenCalled();
        expect(tabCenterTrapListeners['focus']).not.toBeUndefined();
    });

    describe('when the center trap is focused', () => {
        beforeEach(() => tabCenterTrapListeners['focus'](new Event('focus')));

        test('isAppFocused() should return true', () => {
            expect(instance.isAppFocused()).toBe(true);
        });
    });

    describe('given the app is not focused', () => {
        beforeEach((done) => {
            tabCenterTrapListeners['blur'](new Event('blur'));
            setTimeout(() => {
                jest.clearAllMocks();
                done();
            }, 0);
        });

        test('isAppFocused should return false', () => {
            expect(instance.isAppFocused()).toBe(false);
        });

        describe('when the center trap gains focus', () => {
            beforeEach(() => {
                tabCenterTrapListeners['focus'](new Event('focus'));
            });

            test('then all onAppFocus listeners should be invoked', () => {
                expect(onAppFocus).toHaveBeenCalled();
            });
        });
    });

    describe('given the focused internal element is not the first', () => {
        beforeEach(() => instance.setIsFocusedOnFirstElement(false));

        describe('when the center trap is focused', () => {
            beforeEach(() => tabCenterTrapListeners['focus'](new Event('focus')));

            test('then the tab-backwards trap should be enabled', () => {
                expect(tabBackwardsTrap.removeAttribute)
                    .toHaveBeenCalledWith('disabled');
            });
        });
    });

    describe('given the focused internal element is the first', () => {
        beforeEach(() => instance.setIsFocusedOnFirstElement(true));

        describe('when the center trap is focused', () => {
            beforeEach(() => tabCenterTrapListeners['focus'](new Event('focus')));

            test('then the tab-backwards trap should be disabled', () => {
                expect(tabBackwardsTrap.setAttribute)
                    .toHaveBeenCalledWith('disabled', true);
            });
        });
    });

    describe('given the focused internal element is not the last', () => {
        beforeEach(() => instance.setIsFocusedOnLastElement(false));

        describe('when the center trap is focused', () => {
            beforeEach(() => tabCenterTrapListeners['focus'](new Event('focus')));

            test('then the tab-backwards trap should be enabled', () => {
                expect(tabForwardsTrap.removeAttribute)
                    .toHaveBeenCalledWith('disabled');
            });
        });
    });

    describe('given the focused internal element is the last', () => {
        beforeEach(() => instance.setIsFocusedOnLastElement(true));

        describe('when the center trap is focused', () => {
            beforeEach(() => tabCenterTrapListeners['focus'](new Event('focus')));

            test('then the tab-backwards trap should be disabled', () => {
                expect(tabForwardsTrap.setAttribute)
                    .toHaveBeenCalledWith('disabled', true);
            });
        });
    });
});

describe('focusApp', () => {
    beforeEach(() => instance.focusApp());

    test('should call focus() on center trap', () => {
        expect(tabCenterTrap.focus).toHaveBeenCalled();
    });
});

describe('center trap blur', () => {
    test('center trap should have had its blur listener set up', () => {
        expect(tabCenterTrap.addEventListener).toHaveBeenCalled();
        expect(tabCenterTrapListeners['blur']).not.toBeUndefined();
    });

    describe('given app is focused', () => {
        beforeEach(() => {
            tabCenterTrapListeners['focus'](new Event('focus'));
            jest.clearAllMocks();
        });

        describe('when center trap is blurred and then focused', () => {
            beforeEach((done) => {
                tabCenterTrapListeners['blur'](new Event('blur'));
                tabCenterTrapListeners['focus'](new Event('focus'));
                setTimeout(done, 0);
            });
    
            test('all onAppBlur listeners should not be called', () => {
                expect(onAppBlur).not.toHaveBeenCalled();
            });
        });
    });
});
