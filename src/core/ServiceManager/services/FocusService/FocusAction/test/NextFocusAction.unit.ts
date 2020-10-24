import { UiElement } from '../../../../../types';
import { NextFocusAction } from '../NextFocusAction';
import { createDummyElement } from './helpers';

let setFocus: (element: UiElement) => void;
let instance: NextFocusAction;

beforeEach(() => {
    setFocus = jest.fn();
    instance = new NextFocusAction(setFocus);
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

    describe('given focusedElement is prevElement', () => {
        beforeEach(() => {
            prevElement = createDummyElement({ key: 'foo' });
            focusedElement = prevElement.key;
        });

        describe('and given curElement is not undefined', () => {
            beforeEach(() => curElement = createDummyElement({ key: 'bar' }));

            test('should pass curElement into setFocus', () => {
                instance.onSetFocusable(focusedElement, prevElement, curElement);
                expect(setFocus).toHaveBeenCalledWith(curElement);
            });
        });

        describe('and given curElement is undefined', () => {
            test('should not call setFocus', () => {
                instance.onSetFocusable(focusedElement, prevElement, curElement);
                expect(setFocus).not.toHaveBeenCalled();
            });
        });
    });

    describe('given focusedElement is not prevElement', () => {
        beforeEach(() => {
            focusedElement = 'foo';
            prevElement = createDummyElement({ key: 'bar' });
        });

        describe('given curElement is undefined', () => {
            test('should not call setFocus', () => {
                instance.onSetFocusable(focusedElement, prevElement, curElement);
                expect(setFocus).not.toHaveBeenCalled();
            });
        });

        describe('given curElement is not undefined', () => {
            beforeEach(() => curElement = createDummyElement({ key: 'baz' }));

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

    describe('given no element is focused', () => {
        test('should focus firstElement', () => {
            instance.onPreRender(focusedElement, firstElement, lastElement);
            expect(setFocus).toHaveBeenCalledWith(firstElement);
        });
    });

    describe('given firstElement or lastElement are not defined', () => {
        describe.each([
            ['foo', undefined, undefined],
            ['foo', 'bar', undefined],
            ['foo', undefined, 'bar'],
            [undefined, undefined, undefined],
            [undefined, 'foo', undefined],
            [undefined, undefined, 'foo'],
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

    describe('given lastElement is focusedElement', () => {
        beforeEach(() => focusedElement = lastElement && lastElement.key);

        test('should pass firstElement into setFocus', () => {
            instance.onPreRender(focusedElement, firstElement, lastElement);
            expect(setFocus).toHaveBeenCalledWith(firstElement);
        });
    });
});
