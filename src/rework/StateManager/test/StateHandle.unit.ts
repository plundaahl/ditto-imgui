import {
    StateHandleImpl,
    StateHandle,
    RegisterRecordFn,
    GetRecordFn,
} from '../StateHandle';

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

describe('registerRecord()', () => {
    it('Should call doRegisterRecord()', () => {
        instance.registerRecord({ field: 'hi' });
        expect(doRegisterRecord).toHaveBeenCalled();
    });

    it('Should pass its key and the record into doRegisterRecord()', () => {
        const defaultState = { field: 'hi' };
        instance.registerRecord(defaultState);
        expect(doRegisterRecord).toHaveBeenCalledWith(key, defaultState);
    });
});

describe('getRecord()', () => {
    it('Should pass key into doGetRecord()', () => {
        instance.getRecord();
        expect(doGetRecord).toHaveBeenCalled();
        expect(doGetRecord).toHaveBeenCalledWith(key);
    });

    it('Should return result of doGetRecord()', () => {
        const result = instance.getRecord();
        expect(result).toBe(record);
    });
});
