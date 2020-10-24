import { PrevFocusAction } from '../PrevFocusAction';

let setFocus: (element: string) => void;
let instance: PrevFocusAction;

beforeEach(() => {
    setFocus = jest.fn();
    instance = new PrevFocusAction(setFocus);
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

    describe('given focusedElement is curElement', () => {
        beforeEach(() => {
            focusedElement = 'foo';
            curElement = focusedElement;
        });

        describe('and given prevElement is not undefined', () => {
            beforeEach(() => prevElement = 'bar');

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
            curElement = 'bar';
        });

        describe('given prevElement is undefined', () => {
            test('should not call setFocus', () => {
                instance.onSetFocusable(focusedElement, prevElement, curElement);
                expect(setFocus).not.toHaveBeenCalled();
            });
        });

        describe('given prevElement is not undefined', () => {
            beforeEach(() => prevElement = 'baz');

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

    describe('given focusedElement is undefined', () => {
        test('should focus on last element', () => {
            instance.onPostRender(focusedElement, firstElement, lastElement);
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
                instance.onPostRender(focusedElement, firstElement, lastElement);
                expect(setFocus).not.toHaveBeenCalled();
            });
        });
    });

    describe('given firstElement is focusedElement', () => {
        beforeEach(() => focusedElement = firstElement);

        test('should pass lastElement into setFocus', () => {
            instance.onPostRender(focusedElement, firstElement, lastElement);
            expect(setFocus).toHaveBeenCalledWith(lastElement);
        });
    });
});
