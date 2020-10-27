import { createDummyElement } from '../../../../test/helpers';
import { InspectableStateService } from './InspectableStateService';

interface ExampleRecord {
    field: number,
}

let instance: InspectableStateService;

beforeEach(() => {
    instance = new InspectableStateService();
});

describe('get currentStateNode', () => {
    test('Should return the StateNode at the end of keyStack', () => {
        const stateStack = instance.getStateStack();
        const stateNode = { _children: {} };
        stateStack.push(stateNode);
        expect(instance.getCurrentStateNode()).toBe(stateNode);
    });
});

describe('onBeginElement()', () => {
    test('If stateStore does not contain node for key, adds it', () => {
        const key = 'childKey';
        const parentState = instance.getCurrentStateNode();

        instance.onBeginElement(createDummyElement({ key }));

        expect(parentState._children[key]).not.toBe(undefined);
    });

    test('Adds the new stateNode to stateStack', () => {
        const key = 'childKey';
        const parentState = instance.getCurrentStateNode();

        instance.onBeginElement(createDummyElement({ key }));
        const childState = parentState._children[key];
        expect(instance.getCurrentStateNode()).toBe(childState);
    });
});

describe('onEndKey()', () => {
    test('Errors if keyStack is empty', () => {
        expect(() => instance.onEndElement()).toThrowError();
    });

    test('Removes end of stateStack', () => {
        const key = 'childkey';
        instance.onBeginElement(createDummyElement({ key }));

        const lengthBeforeEnd = instance.getStateStack().length;

        instance.onEndElement();

        expect(instance.getStateStack().length).toBe(lengthBeforeEnd - 1);
    });
});

describe('createHandle()', () => {
    test('Should error if a duplicate key is registered', () => {
        const key = 'somekey';
        instance.createHandle<ExampleRecord>(key);
        expect(() => instance.createHandle<ExampleRecord>(key))
            .toThrowError();
    });
});

describe('initDefaultState()', () => {
    test('If current node does not contain record, copies from defaultState', () => {
        const key = 'justakey';
        const defaultState = { field: 1234 };

        expect((instance.getCurrentStateNode() as any)[key]).toBe(undefined);

        instance.doDeclareAndGetState<ExampleRecord>(key, defaultState);

        const record = (instance.getCurrentStateNode() as any)[key];

        expect(record).not.toBe(undefined);
        expect(JSON.stringify(record)).toEqual(JSON.stringify(record));
    });

    test('When initializing a record, resulting record is a copy', () => {
        const key = 'justakey';
        const defaultState = { field: 1234 };

        instance.doDeclareAndGetState<ExampleRecord>(key, defaultState);

        const record = (instance.getCurrentStateNode() as any)[key];
        expect(record).not.toBe(defaultState);
    });

    test('If current node is initialized, does not reinitialize it', () => {
        const key = 'justakey';
        const defaultState = { field: 1234 };

        instance.doDeclareAndGetState<ExampleRecord>(key, defaultState);
        const record = (instance.getCurrentStateNode() as any)[key];

        instance.doDeclareAndGetState<ExampleRecord>(key, defaultState);
        expect((instance.getCurrentStateNode() as any)[key]).toBe(record);
    });
});

describe('getState()', () => {
    test('Returns the registered record for the current node', () => {
        const key = 'justakey';
        const defaultState = { field: 1234 };

        const record = instance.doDeclareAndGetState<ExampleRecord>(key, defaultState);

        expect(instance.doDeclareAndGetState<ExampleRecord>(key, defaultState)).toBe(record);
    });
});
