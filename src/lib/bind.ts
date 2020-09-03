export interface BindFn<T> {
    (value?: T): T;
}

export function createBindFn<T>(init: T): BindFn<T> {
    let state = init;
    return (_ = state) => state = _;
}

export type ObjectBinding<T extends Object> = {
    [K in keyof T]: BindFn<T[K]>
}

export function createObjectBinding<T extends Object>(source: T): ObjectBinding<T> {
    const binding: Partial<ObjectBinding<T>> = {};
    for (let key in source) {
        if (source.hasOwnProperty(key)) {
            binding[key] = (_ = source[key]) => source[key] = _;
        }
    }
    return binding as ObjectBinding<T>;
}
