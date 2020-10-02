export interface StateHandle<T extends {}> {
    initDefaultState(defaultState: T): void;
    getState(): T;
}

