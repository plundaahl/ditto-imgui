import { ActionPlugin, ActionPluginManager } from '../ActionPluginManager';
import { ActionPluginManagerImpl } from '../ActionPluginManagerImpl';
import { createDummyActionPlugin } from './helpers';

let providerA: ActionPlugin;
let providerB: ActionPlugin;
let providerC: ActionPlugin;
let instance: ActionPluginManager;

beforeEach(() => {
    providerA = createDummyActionPlugin();
    providerB = createDummyActionPlugin();
    providerC = createDummyActionPlugin();

    instance = new ActionPluginManagerImpl();

    instance.registerPlugin(providerA);
    instance.registerPlugin(providerB);
    instance.registerPlugin(providerC);
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
