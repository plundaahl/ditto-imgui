import { Controller, ControllerManager } from '../ControllerManager';
import { ControllerManagerImpl } from '../ControllerManagerImpl';
import { createDummyController } from './helpers';

let providerA: Controller;
let providerB: Controller;
let providerC: Controller;
let instance: ControllerManager;

beforeEach(() => {
    providerA = createDummyController();
    providerB = createDummyController();
    providerC = createDummyController();

    instance = new ControllerManagerImpl(
        providerA,
        providerB,
        providerC
    );
});

describe.each([
    'isElementHighlighted',
    'isElementReadied',
    'isElementTriggered',
    'isElementToggled',
    'isElementQueried',
    'isElementDragged',
    'isElementInteracted',
    'isChildInteracted',
    'isFloatingChildInteracted',
])(`%s`, (
    method: 'isElementHighlighted'
        | 'isElementReadied'
        | 'isElementToggled'
        | 'isElementTriggered'
        | 'isElementQueried'
        | 'isElementDragged'
        | 'isElementInteracted'
        | 'isChildInteracted'
        | 'isFloatingChildInteracted'
) => {
    test('If all providers return false, calls each of them', () => {
        instance[method]();
        expect(providerA[method]).toHaveBeenCalled();
        expect(providerB[method]).toHaveBeenCalled();
        expect(providerC[method]).toHaveBeenCalled();
    });

    test('When all providers return false, returns false', () => {
        expect(instance[method]()).toBe(false);
    });

    test('When one of the providers returns true, returns true', () => {
        providerB[method] = () => true;
        expect(instance[method]()).toBe(true);
    });
});

describe.each([
    'getDragX',
    'getDragY',
])('%s', (method: 'getDragX' | 'getDragY') => {
    describe('Given no provider is dragged', () => {
        test(`${method} should return 0`, () => {
            expect(instance[method]()).toBe(0);
        });
    });

    describe('Given a provider is dragged', () => {
        let valueReturned: number;

        beforeEach(() => {
            valueReturned = 233;
            providerB.isElementDragged = () => true;
            providerB[method] = () => valueReturned;
        });

        test('Should return value of the first provider that isDragged', () => {
            expect(instance[method]()).toBe(valueReturned);
        });
    });
});

describe('onPostRender', () => {
    beforeEach(() => {
        providerA.onPostRender = jest.fn();
        providerB.onPostRender = jest.fn();
    });

    test('Should call onPostRender on each controller', () => {
        instance.onPostRender();
        expect(providerA.onPostRender).toHaveBeenCalled();
        expect(providerB.onPostRender).toHaveBeenCalled();
    });
});
