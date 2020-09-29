export interface StateHandle<T extends {}> {
    registerRecord(defaultState: T): void;
    getRecord(): T;
}

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

    registerRecord(defaultState: T): void {
        this.doRegisterRecord(this.key, defaultState);
    }

    getRecord(): T {
        return this.doGetRecord(this.key);
    }
}
