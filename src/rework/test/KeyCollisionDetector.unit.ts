import { KeyCollisionDetector } from '../KeyCollisionDetector';

let instance: KeyCollisionDetector;

beforeEach(() => { instance = new KeyCollisionDetector(); });

describe('beginKey()', () => {
    test('Should error if same key is added twice before reset', () => {
        const key = 'foo';
        instance.beginKey(key);
        instance.endKey();
        expect(() => { instance.beginKey(key) }).toThrowError();
    });

    test('Should not error if same key is added before and after reset', () => {
        const key = 'foo';
        instance.beginKey(key);
        instance.endKey();
        instance.reset();
        expect(() => { instance.beginKey(key) }).not.toThrowError();
    });
});

describe('reset()', () => {
    test('Should error if there are keys left on the stack', () => {
        instance.beginKey('foo');
        expect(() => { instance.reset(); }).toThrowError();
    });
});
