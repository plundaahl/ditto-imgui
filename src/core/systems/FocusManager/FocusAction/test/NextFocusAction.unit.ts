import { NextFocusAction } from '../NextFocusAction';

let setFocus: (element: string) => void;
let instance: NextFocusAction;

beforeEach(() => {
    setFocus = jest.fn();
    instance = new NextFocusAction(setFocus);
});

describe('onSetFocusable', () => {
    let focusedElement: string | undefined;
    let curElement: string | undefined;
    let prevElement: string | undefined;

    afterEach(() => {
        focusedElement = undefined;
        curElement = undefined;
        prevElement = undefined;
    });

    describe('given focusedElement is prevElement', () => {
        beforeEach(() => {
            focusedElement = 'foo';
            prevElement = focusedElement;
        });

        describe('and given curElement is not undefined', () => {
            beforeEach(() => curElement = 'bar');

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
            prevElement = 'bar';
        });

        describe('given curElement is undefined', () => {
            test('should not call setFocus', () => {
                instance.onSetFocusable(focusedElement, prevElement, curElement);
                expect(setFocus).not.toHaveBeenCalled();
            });
        });

        describe('given curElement is not undefined', () => {
            beforeEach(() => curElement = 'baz');

            test('should not call setFocus', () => {
                instance.onSetFocusable(focusedElement, prevElement, curElement);
                expect(setFocus).not.toHaveBeenCalled();
            });
        });
    });
});

describe('onPostRender', () => {
    let focusedElement: string | undefined;
    let firstElement: string | undefined;
    let lastElement: string | undefined;
    
    beforeEach(() => {
        focusedElement = undefined;
        firstElement = 'first';
        lastElement = 'last';
    });

    describe('given all parameters are undefined', () => {
        beforeEach(() => {
            firstElement = undefined;
            lastElement = undefined;
            focusedElement = undefined;
        });

        test('should do nothing', () => {
            instance.onPostRender(focusedElement, firstElement, lastElement);
            expect(setFocus).not.toHaveBeenCalled();
        });
    });

    describe('given no element is focused', () => {
        test('should focus firstElement', () => {
            instance.onPostRender(focusedElement, firstElement, lastElement);
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
                instance.onPostRender(focusedElement, firstElement, lastElement);
                expect(setFocus).not.toHaveBeenCalled();
            });
        });
    });

    describe('given lastElement is focusedElement', () => {
        beforeEach(() => focusedElement = lastElement);

        test('should pass firstElement into setFocus', () => {
            instance.onPostRender(focusedElement, firstElement, lastElement);
            expect(setFocus).toHaveBeenCalledWith(firstElement);
        });
    });
});
