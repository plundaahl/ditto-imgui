import { StateHandle } from '../StateHandle';
import { StateHandleImpl, RegisterRecordFn, GetRecordFn } from '../StateHandleImpl';

interface TestRecord {
    field: string,
}

let instance: StateHandle<TestRecord>;
let doRegisterRecord: RegisterRecordFn<TestRecord>;
let doGetRecord: GetRecordFn<TestRecord>;
let record: TestRecord;
let key: string = 'someKey';

beforeEach(() => {
    record = { field: '' };
    doRegisterRecord = jest.fn();
    doGetRecord = jest.fn();
    instance = new StateHandleImpl(
        key,
        doRegisterRecord,
        (key: string) => {
            doGetRecord(key);
            return record;
        },
    );
});

describe('initDefaultState()', () => {
    it('Should call doRegisterRecord()', () => {
        instance.initDefaultState({ field: 'hi' });
        expect(doRegisterRecord).toHaveBeenCalled();
    });

    it('Should pass its key and the record into doRegisterRecord()', () => {
        const defaultState = { field: 'hi' };
        instance.initDefaultState(defaultState);
        expect(doRegisterRecord).toHaveBeenCalledWith(key, defaultState);
    });
});

describe('getState()', () => {
    it('Should pass key into doGetRecord()', () => {
        instance.getState();
        expect(doGetRecord).toHaveBeenCalled();
        expect(doGetRecord).toHaveBeenCalledWith(key);
    });

    it('Should return result of doGetRecord()', () => {
        const result = instance.getState();
        expect(result).toBe(record);
    });
});
