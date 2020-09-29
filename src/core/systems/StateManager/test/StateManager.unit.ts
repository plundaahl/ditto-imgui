import { StateManager, StateManagerImpl } from '../StateManager';

class InspectableStateManager extends StateManagerImpl {

    getStateStack() { return this.stateStack; }
    getCurrentStateNode() { return this.currentStateNode; }

    doRegisterRecord<T extends {}>(key: string, defaultState: T) {
        this.registerRecord(key, defaultState);
    }

    doGetRecord<T extends {}>(key: string) {
        return this.getRecord(key);
    }
}

interface ExampleRecord {
    field: number,
}

let instance: InspectableStateManager;

beforeEach(() => {
    instance = new InspectableStateManager();
});

describe('get currentStateNode', () => {
    test('Should return the StateNode at the end of keyStack', () => {
        const stateStack = instance.getStateStack();
        const stateNode = { _children: {} };
        stateStack.push(stateNode);
        expect(instance.getCurrentStateNode()).toBe(stateNode);
    });
});

describe('beginKey()', () => {
    test('If stateStore does not contain node for key, adds it', () => {
        const key = 'childKey';
        const parentState = instance.getCurrentStateNode();

        instance.beginKey(key);

        expect(parentState._children[key]).not.toBe(undefined);
    });

    test('Adds the new stateNode to stateStack', () => {
        const key = 'childKey';
        const parentState = instance.getCurrentStateNode();

        instance.beginKey(key);
        const childState = parentState._children[key];
        expect(instance.getCurrentStateNode()).toBe(childState);
    });
});

describe('endKey()', () => {
    test('Errors if keyStack is empty', () => {
        expect(() => instance.endKey()).toThrowError();
    });

    test('Removes end of stateStack', () => {
        const key = 'childkey';
        instance.beginKey(key);

        const lengthBeforeEnd = instance.getStateStack().length;

        instance.endKey();

        expect(instance.getStateStack().length).toBe(lengthBeforeEnd - 1);
    });
});

describe('registerHandle()', () => {
    test('Should error if a duplicate key is registered', () => {
        const key = 'somekey';
        instance.registerHandle<ExampleRecord>(key);
        expect(() => instance.registerHandle<ExampleRecord>(key))
            .toThrowError();
    });
});

describe('registerRecord()', () => {
    test('If current node does not contain record, copies from defaultState', () => {
        const key = 'justakey';
        const defaultState = { field: 1234 };

        expect((instance.getCurrentStateNode() as any)[key]).toBe(undefined);

        instance.doRegisterRecord<ExampleRecord>(key, defaultState);

        const record = (instance.getCurrentStateNode() as any)[key];

        expect(record).not.toBe(undefined);
        expect(JSON.stringify(record)).toEqual(JSON.stringify(record));
    });

    test('When initializing a record, resulting record is a copy', () => {
        const key = 'justakey';
        const defaultState = { field: 1234 };

        instance.doRegisterRecord<ExampleRecord>(key, defaultState);

        const record = (instance.getCurrentStateNode() as any)[key];
        expect(record).not.toBe(defaultState);
    });

    test('If current node is initialized, does not reinitialize it', () => {
        const key = 'justakey';
        const defaultState = { field: 1234 };

        instance.doRegisterRecord<ExampleRecord>(key, defaultState);
        const record = (instance.getCurrentStateNode() as any)[key];

        instance.doRegisterRecord<ExampleRecord>(key, defaultState);
        expect((instance.getCurrentStateNode() as any)[key]).toBe(record);
    });
});

describe('getRecord()', () => {
    test('Errors if current node does not contain record', () => {
        expect(() => instance.doGetRecord('notarealkey')).toThrowError();
    });

    test('Returns the registered record for the current node', () => {
        const key = 'justakey';
        const defaultState = { field: 1234 };

        instance.doRegisterRecord<ExampleRecord>(key, defaultState);
        const record = (instance.getCurrentStateNode() as any)[key];

        expect(instance.doGetRecord(key)).toBe(record);
    });
});
