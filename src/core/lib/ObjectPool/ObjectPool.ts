export class ObjectPool<T> {
    protected readonly elements: T[] = [];

    constructor(
        private readonly factoryFn: () => T,
        private readonly resetFn: (object: T) => void,
    ) {}

    release(element: T) {
        this.resetFn(element);
        this.elements.push(element);
    }

    provision(): T {
        const element = this.elements.pop();
        if (element === undefined) {
            return this.factoryFn();
        }
        return element;
    }
}
