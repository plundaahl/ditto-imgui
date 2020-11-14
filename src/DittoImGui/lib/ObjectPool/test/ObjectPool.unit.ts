import { ObjectPool } from '../ObjectPool';

class IntrospectiveObjectPool<T> extends ObjectPool<T> {
    getElements() { return this.elements; }
}

class TestElement { foo: string = ""; }

let factoryFnSpy: () => void;
let resetFnSpy: (...args: any[]) => void;
let instance: IntrospectiveObjectPool<TestElement>;

beforeEach(() => {
    factoryFnSpy = jest.fn();
    resetFnSpy = jest.fn();

    const create = () => {
        factoryFnSpy();
        return new TestElement();
    }

    const reset = (element: TestElement) => {
        resetFnSpy(element);
        element.foo = "";
    }

    instance = new IntrospectiveObjectPool(create, reset);
});

describe('provision()', () => {
    test('If elements are empty, calls factoryFn', () => {
        expect(instance.getElements().length).toBe(0);
        instance.provision();
        expect(factoryFnSpy).toHaveBeenCalled();
    });

    test('If elements are not empty, elements should be reduced by 1', () => {
        instance.getElements().push(new TestElement());
        expect(instance.getElements().length).toBe(1);
        instance.provision();
        expect(instance.getElements().length).toBe(0);
    });

    test('If elements are not empty, should not call createFn', () => {
        instance.getElements().push(new TestElement());
        instance.provision();
        expect(factoryFnSpy).not.toHaveBeenCalled();
    });
});

describe('release()', () => {
    test('Puts the element back on the elements stack', () => {
        let element = new TestElement();
        instance.release(element);
        expect(instance.getElements()[0]).toBe(element);
    });

    test('Passes the element into the resetFn', () => {
        let element = new TestElement();
        instance.release(element);
        expect(resetFnSpy).toHaveBeenCalledWith(element);
    });
});
