import { StateHandle } from '../StateHandle';
import { StateHandleImpl, DeclareAndGetStateFn } from '../StateHandleImpl';

interface TestRecord {
    field: string,
}

let instance: StateHandle<TestRecord>;
let doDeclareAndGetState: DeclareAndGetStateFn<TestRecord>;
let record: TestRecord;
let key: string = 'someKey';

beforeEach(() => {
    record = { field: '' };
    doDeclareAndGetState = jest.fn();
    instance = new StateHandleImpl(
        key,
        (key: string, defaultState: TestRecord) => {
            doDeclareAndGetState(key, defaultState);
            return record;
        },
    );
});

describe('declareAndGetState', () => {
    it('Should pass its key and the record into doDeclareAndGetState', () => {
        const defaultState = { field: 'hi' };
        instance.declareAndGetState(defaultState);
        expect(doDeclareAndGetState).toHaveBeenCalledWith(key, defaultState);
    });

    it('Should return result of doDeclareAndGetState', () => {
        const result = instance.declareAndGetState(record);
        expect(result).toBe(record);
    });
});
