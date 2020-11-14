import { StateHandle } from './StateHandle';

export interface DeclareAndGetStateFn<T extends {}> {
    (key: string, defaultState: T): T;
}

export class StateHandleImpl<T extends {}> implements StateHandle<T> {
    constructor(
        private key: string,
        private declareAndGetStateFn: DeclareAndGetStateFn<T>,
    ) {}

    declareAndGetState(defaultState: T): T {
        return this.declareAndGetStateFn(this.key, defaultState);
    }
}
