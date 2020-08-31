export interface BindFn<T> {
    (value?: T): T;
}

export function createBindFn<T>(init: T): BindFn<T> {
    let state = init;
    return (_ = state) => state = _;
}
