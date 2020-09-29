import { KeyBuilderImpl } from '../KeyBuilderImpl';


let instance: KeyBuilderImpl;
beforeEach(() => instance = new KeyBuilderImpl());

describe('getCurrentQualifiedKey', () => {
    test('should error if no element pushed', () => {
        expect(instance.getCurrentQualifiedKey).toThrow();
    });

    describe('after exactly one push', () => {
        const key = 'firstkey';
        beforeEach(() => instance.push(key));

        test('should return key that was pushed', () => {
            expect(instance.getCurrentQualifiedKey()).toBe(key);
        });
    });

    describe('with multiple pushes', () => {
        const keys = ['root', 'second', 'third'];

        beforeEach(() => {
            for (const key of keys) {
                instance.push(key)
            }
        });

        test('should return all keys pushed so-far, separated with "/" characters', () => {
            expect(instance.getCurrentQualifiedKey()).toBe(keys.join('/'));
        });
    });

    describe('after a pop', () => {
        const keys = ['root', 'second', 'third'];

        test('should return the qualified key before the previous push', () => {
            instance.push(keys[0]);
            instance.push(keys[1]);

            const prevQualifiedKey = instance.getCurrentQualifiedKey();
            
            instance.push(keys[2]);
            instance.pop();
            
            expect(instance.getCurrentQualifiedKey()).toBe(prevQualifiedKey);
        });
    });
});

describe('pop', () => {
    test('should error if no key pushed', () => {
        expect(instance.pop).toThrow();
    });
});

describe('push', () => {
    test('should error if key contains "/" characters', () => {
        expect(() => instance.push('not/aValidKey')).toThrow();
    });

    test('should error if key is empty', () => {
        expect(() => instance.push('')).toThrow();
    });

    test('otherwise, should not error otherwise', () => {
        expect(() => instance.push('validKey')).not.toThrow();
    });
});

