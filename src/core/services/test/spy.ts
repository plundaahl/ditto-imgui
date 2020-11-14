export function spy<T extends {[key: string]: any}>(obj: T) {
    for (const prop in obj) {
        if (obj.hasOwnProperty(prop) && typeof obj[prop] === 'function') {
            obj[prop] = jest.fn(obj[prop]) as any;
        }
    }
    return obj;
}
