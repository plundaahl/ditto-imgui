export interface StateHandle<T extends {}> {
    declareAndGetState(defaultState: T): T;
}

