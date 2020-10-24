import { UiElement } from '../../../../../types';
import { PrevFocusAction } from '../PrevFocusAction';
import { createDummyElement } from './helpers';

let setFocus: (element: UiElement) => void;
let instance: PrevFocusAction;

beforeEach(() => {
    setFocus = jest.fn();
    instance = new PrevFocusAction(setFocus);
});

describe('onSetFocusable', () => {
    let focusedElement: string | undefined;
    let curElement: UiElement | undefined;
    let prevElement: UiElement | undefined;

    afterEach(() => {
        focusedElement = undefined;
        curElement = undefined;
        prevElement = undefined;
    });

    describe('given focusedElement is curElement', () => {
        beforeEach(() => {
            focusedElement = 'foo';
            curElement = createDummyElement({ key: focusedElement });
        });

        describe('and given prevElement is not undefined', () => {
            beforeEach(() => prevElement = createDummyElement({ key: 'bar' }));

            test('should pass prevElement into setFocus', () => {
                instance.onSetFocusable(focusedElement, prevElement, curElement);
                expect(setFocus).toHaveBeenCalledWith(prevElement);
            });
        });

        describe('and given prevElement is undefined', () => {
            test('should not call setFocus', () => {
                instance.onSetFocusable(focusedElement, prevElement, curElement);
                expect(setFocus).not.toHaveBeenCalled();
            });
        });
    });

    describe('given focusedElement is not curElement', () => {
        beforeEach(() => {
            focusedElement = 'foo';
            curElement = createDummyElement({ key: 'bar' });
        });

        describe('given prevElement is undefined', () => {
            test('should not call setFocus', () => {
                instance.onSetFocusable(focusedElement, prevElement, curElement);
                expect(setFocus).not.toHaveBeenCalled();
            });
        });

        describe('given prevElement is not undefined', () => {
            beforeEach(() => prevElement = createDummyElement({ key: 'baz' }));

            test('should not call setFocus', () => {
                instance.onSetFocusable(focusedElement, prevElement, curElement);
                expect(setFocus).not.toHaveBeenCalled();
            });
        });
    });
});

describe('onPreRender', () => {
    let focusedElement: string | undefined;
    let firstElement: UiElement | undefined;
    let lastElement: UiElement | undefined;
    
    beforeEach(() => {
        focusedElement = undefined;
        firstElement = createDummyElement({ key: 'first' });
        lastElement = createDummyElement({ key: 'last' });
    });

    describe('given all parameters are undefined', () => {
        beforeEach(() => {
            firstElement = undefined;
            lastElement = undefined;
            focusedElement = undefined;
        });

        test('should do nothing', () => {
            instance.onPreRender(focusedElement, firstElement, lastElement);
            expect(setFocus).not.toHaveBeenCalled();
        });
    });

    describe('given focusedElement is undefined', () => {
        test('should focus on last element', () => {
            instance.onPreRender(focusedElement, firstElement, lastElement);
            expect(setFocus).toHaveBeenCalledWith(lastElement);
        });
    });

    describe('given firstElement or lastElement are undefined', () => {
        describe.each([
            [undefined, 'foo', undefined],
            [undefined, undefined, 'foo'],
            [undefined, undefined, undefined],
            ['foo', undefined, undefined],
            ['foo', 'bar', undefined],
            ['foo', undefined, 'bar'],
        ])('given focused, first, last are %s, %s, %s', (
            focusedElement, firstElement, lastElement,
        ) => {
            test('should do nothing', () => {
                instance.onPreRender(
                    focusedElement,
                    firstElement
                        ? createDummyElement({ key: firstElement })
                        : undefined,
                    lastElement
                        ? createDummyElement({ key: lastElement })
                        : undefined,
                );
                expect(setFocus).not.toHaveBeenCalled();
            });
        });
    });

    describe('given firstElement is focusedElement', () => {
        beforeEach(() => focusedElement = firstElement && firstElement.key);

        test('should pass lastElement into setFocus', () => {
            instance.onPreRender(focusedElement, firstElement, lastElement);
            expect(setFocus).toHaveBeenCalledWith(lastElement);
        });
    });
});
