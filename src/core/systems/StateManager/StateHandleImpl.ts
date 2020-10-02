import { StateHandle } from './StateHandle';

export interface RegisterRecordFn<T extends {}> {
    (key: string, defaultState: T): void;
}

export interface GetRecordFn<T extends {}> {
    (key: string): T;
}

export class StateHandleImpl<T extends {}> implements StateHandle<T> {
    constructor(
        private key: string,
        private doRegisterRecord: RegisterRecordFn<T>,
        private doGetRecord: GetRecordFn<T>,
    ) {}

    initDefaultState(defaultState: T): void {
        this.doRegisterRecord(this.key, defaultState);
    }

    getState(): T {
        return this.doGetRecord(this.key);
    }
}
