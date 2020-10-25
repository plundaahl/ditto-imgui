import { KeyboardController } from '../KeyboardController';
import { KeyMap } from '../KeyMap';
import {
    createKeyboardEntryObjectPool,
    KeyboardCPI,
    KeyboardService,
    KeyboardServiceImpl,
} from '../../../../ServiceManager/services/KeyboardService';
import {
    FocusCPI,
    FocusService,
    FocusServiceImpl,
} from '../../../../ServiceManager/services/FocusService';

let keyboard: KeyboardService;
let focus: FocusService;
let keymap: KeyMap = {
    trigger: [ 'Enter' ],
    toggle: [ 'Space' ],
    query: [ 'ContextMenu' ],
    cancel: [ 'Escape' ],
    moveLeft: [ 'ArrowLeft' ],
    moveRight: [ 'ArrowRight' ],
    moveUp: [ 'ArrowUp' ],
    moveDown: [ 'ArrowDown' ],
};
let instance: KeyboardController;

beforeEach(() => {
    keyboard = spy(new KeyboardServiceImpl(
        createKeyboardEntryObjectPool(),
        { addEventListener: jest.fn() },
    ));

    focus = spy(new FocusServiceImpl());

    instance = new KeyboardController(
        keyboard,
        focus,
        keymap,
    );
});

describe('isElementHighlighted', () => {
    test('returns false', () => {
        expect(instance.isElementHighlighted()).toBe(false);
    });
});

describe('isElementReadied', () => {
    test('If isElementFocused = true, passes each trigger keymap into keyboard.isCodeDown', () => {
        focus.isElementFocused = () => true;
        instance.onPostRender();
        instance.isElementReadied();
        expect(keyboard.isCodeDown).toHaveBeenCalledWith(keymap.trigger[0]);
    });

    describe.each([
        true, false,
    ])('Given focus.isElementFocused returns %s', (focused) => {
        beforeEach(() => focus.isElementFocused = () => focused);

        describe.each([
            true, false,
        ])('Given keyboard.isCodeDown returns %s', (keyCodeDown) => {
            beforeEach(() => keyboard.isCodeDown = () => keyCodeDown);

            test(`Should return ${focused && keyCodeDown}`, () => {
                instance.onPostRender();
                expect(instance.isElementReadied()).toBe(focused && keyCodeDown);
            });
        });
    });
});

describe('isElementTriggered', () => {
    describe.each([
        // focused, triggerEntered, cancelUp, expected
        [true, true, true, true],
        [true, true, false, false],
        [true, false, true, false],
        [true, false, false, false],
        [false, true, true, false],
        [false, true, false, false],
        [false, false, true, false],
        [false, false, false, false],
    ])('Given focused=%s, triggerEntered=%s, cancelUp=%s', (
        focused,
        triggerEntered,
        cancelUp,
        expected,
    ) => {
        beforeEach(() => {
            focus.isElementFocused = () => focused;

            keyboard.isCodeEntered = (key) => {
                return (
                    (triggerEntered && (key === keymap.trigger[0]))
                    || (!cancelUp && (key === keymap.cancel[0]))
                );
            };

            keyboard.isCodeDown = (key) => {
                return (
                    (!cancelUp && (key === keymap.cancel[0]))
                    || (triggerEntered && (key === keymap.trigger[0]))
                );
            };

            keyboard.isCodeUp = (key) => {
                return (cancelUp && (key === keymap.cancel[0]))
            };
        });

        test(`Should return ${expected}`, () => {
            instance.onPostRender();
            expect(instance.isElementTriggered()).toBe(expected);
        });
    });
});

describe('isElementToggled', () => {
    describe.each([
        // focused, toggleEntered, cancelUp, expected
        [true, true, true, true],
        [true, true, false, false],
        [true, false, true, false],
        [true, false, false, false],
        [false, true, true, false],
        [false, true, false, false],
        [false, false, true, false],
        [false, false, false, false],
    ])('Given focused=%s, triggerEntered=%s, cancelUp=%s', (
        focused,
        toggleEntered,
        cancelUp,
        expected,
    ) => {
        beforeEach(() => {
            focus.isElementFocused = () => focused;

            keyboard.isCodeEntered = (key) => {
                return (
                    (toggleEntered && (key === keymap.toggle[0]))
                    || (!cancelUp && (key === keymap.cancel[0]))
                );
            };

            keyboard.isCodeDown = (key) => {
                return (
                    (!cancelUp && (key === keymap.cancel[0]))
                    || (toggleEntered && (key === keymap.toggle[0]))
                );
            };

            keyboard.isCodeUp = (key) => {
                return (cancelUp && (key === keymap.cancel[0]))
            };
        });

        test(`Should return ${expected}`, () => {
            instance.onPostRender();
            expect(instance.isElementToggled()).toBe(expected);
        });
    });
});

describe('isElementQueried', () => {
    describe.each([
        // focused, queryEntered, cancelUp, expected
        [true, true, true, true],
        [true, true, false, false],
        [true, false, true, false],
        [true, false, false, false],
        [false, true, true, false],
        [false, true, false, false],
        [false, false, true, false],
        [false, false, false, false],
    ])('Given focused=%s, triggerEntered=%s, cancelUp=%s', (
        focused,
        queryEntered,
        cancelUp,
        expected,
    ) => {
        beforeEach(() => {
            focus.isElementFocused = () => focused;

            keyboard.isCodeEntered = (key) => {
                return (
                    (queryEntered && (key === keymap.query[0]))
                    || (!cancelUp && (key === keymap.cancel[0]))
                );
            };

            keyboard.isCodeDown = (key) => {
                return (
                    (!cancelUp && (key === keymap.cancel[0]))
                    || (queryEntered && (key === keymap.query[0]))
                );
            };

            keyboard.isCodeUp = (key) => {
                return (cancelUp && (key === keymap.cancel[0]))
            };
        });

        test(`Should return ${expected}`, () => {
            instance.onPostRender();
            expect(instance.isElementQueried()).toBe(expected);
        });
    });
});

describe('isElementDragged', () => {
    describe.each([true, false])('Given element focused = %s', (focused) => {
        beforeEach(() => focus.isElementFocused = () => focused);

        describe.each([
            'moveUp', 'moveDown', 'moveLeft', 'moveRight',
        ])('And given key %s...', (
            arrow: 'moveUp' | 'moveDown' | 'moveLeft' | 'moveRight',
        ) => {

            describe.each([true, false])('... is entered = %s', (pressed) => {
                const expected = pressed && focused;

                beforeEach(() => {
                    keyboard.isCodeEntered = (key) => (
                        pressed && key === keymap[arrow][0]
                    );
                });

                test(`should return ${expected}`, () => {
                    instance.onPostRender();
                    expect(instance.isElementDragged()).toBe(expected);
                });
            });
        });
    });
});

function spy<T extends {[key: string]: any}>(obj: T) {
    for (const prop in obj) {
        if (obj.hasOwnProperty(prop) && typeof obj[prop] === 'function') {
            obj[prop] = jest.fn(obj[prop]) as any;
        }
    }
    return obj;
}
