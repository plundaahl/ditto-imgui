import { IOrderedSet, ArrayOrderedSet } from '../OrderedSet';

class IntrospectiveArrayOrderedSet<T> extends ArrayOrderedSet<T> {
    public setData(...args: T[]) {
        this._data.length = 0;
        this._data.push(...args);
    }

    public getData() {
        return this._data;
    }

    public doDefragment() {
        this.defragment();
    }
}

describe('ArrayOrderedSet', () => {

    const testData = [
        [[1, 4, undefined, 6, 9, undefined, undefined, 3, undefined, 2], [1, 4, 6, 9, 3, 2]],
        [[undefined, undefined, undefined, undefined, undefined, undefined, undefined], []],
        [[3, 7, 2, undefined, undefined, undefined, undefined], [3, 7, 2]],
        [[undefined, undefined, undefined, undefined, undefined, undefined, 4, 9], [4, 9]],
    ];

    describe('defragment', () => {
        let instance: IntrospectiveArrayOrderedSet<number>;

        beforeEach(() => instance = new IntrospectiveArrayOrderedSet());

        test.each(testData)('Removes all undefined elements', (input: number[], output: number[]) => {
            instance.setData(...input);
            instance.doDefragment();
            for (let element of instance.getData()) {
                expect(element).not.toBeUndefined();
            }
        });

        test.each(testData)('Sets length to the number of elements in test data', (input: number[], output: number[]) => {
            instance.setData(...input);
            instance.doDefragment();
            expect(instance.getData().length).toBe(output.length);
        });

        test.each(testData)('Maintains order of defined elements', (input: number[], output: number[]) => {
            instance.setData(...input);
            instance.doDefragment();
            for (let i in output) {
                expect(instance.getData()[i]).toBe(output[i]);
            }
        });
    });

    describe('iteration', () => {
        let instance: IOrderedSet<number>;
        beforeEach(() => instance = new ArrayOrderedSet());

        test('Should return once for each unique element pushed', () => {
            instance.pushToFront(3);
            instance.pushToFront(6);
            instance.pushToFront(6);
            instance.pushToFront(3);
            instance.pushToFront(6);
            instance.pushToFront(1);

            expect([...instance].length).toBe(3);
        });

        test('Should not return for any deleted elements', () => {
            instance.pushToFront(3);
            instance.pushToFront(6);
            instance.pushToFront(7);
            instance.pushToFront(9);

            instance.delete(6);

            expect([...instance].includes(6)).toBe(false);
        });

        test('Elements should be returned in order pushed', () => {
            instance.pushToFront(3);
            instance.pushToFront(6);
            instance.pushToFront(7);
            instance.pushToFront(9);
            instance.pushToFront(3);
            instance.pushToFront(7);

            expect(JSON.stringify([...instance]))
                .toBe(JSON.stringify([6, 9, 3, 7]));
        });

        test('Should handle only undefined elements', () => {
            instance.pushToFront(3);
            instance.pushToFront(6);
            instance.pushToFront(7);
            instance.pushToFront(9);
            instance.pushToFront(3);
            instance.pushToFront(7);
            instance.pushToFront(6);

            instance.delete(3);
            instance.delete(7);
            instance.delete(9);
            instance.delete(6);

            expect([...instance].length).toBe(0);
        });
    });

    describe('has()', () => {
        let instance: IOrderedSet<number>;
        beforeEach(() => instance = new ArrayOrderedSet());

        test('Should return false for a element that was never added', () => {
            expect(instance.has(7)).toBeFalsy();
        });

        test('Should return false for a deleted element', () => {
            instance.pushToFront(7);
            instance.delete(7);
            expect(instance.has(7)).toBeFalsy();
        });

        test('Should return true for an element that is present', () => {
            instance.pushToFront(7);
            expect(instance.has(7)).toBeTruthy();
        });
    });
});
