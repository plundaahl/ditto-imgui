export interface IOrderedSet<T> extends Iterable<T> {
    pushToFront(element: T): void;
    delete(element: T): void;
    has(element: T): boolean;
}

export class ArrayOrderedSet<T> implements IOrderedSet<T> {
    protected readonly _data: Array<T> = [];

    pushToFront(element: T): void {
        const { _data } = this;
        for (let i = 0; i < _data.length; i++) {
            if (_data[i] === element) {
                delete _data[i];
                break;
            }
        }
        _data.push(element);
    }

    delete(element: T): void {
        const { _data } = this;
        for (let i = 0; i < _data.length; i++) {
            if (_data[i] === element) {
                delete _data[i];
                return;
            }
        }
    }

    has(element: T): boolean {
        return this._data.includes(element);
    }

    [Symbol.iterator](): Iterator<T, any, undefined> {
        this.defragment();
        const { _data } = this;
        let i = -1;

        return {
            next: () => {
                while (++i < _data.length) {
                    if (_data[i] !== undefined) {
                        return { value: _data[i] };
                    }
                }

                return {
                    value: undefined,
                    done: true,
                }
            }
        }
    }

    protected defragment() {
        const { _data } = this;
        let tail = 0;
        let head = 0;

        while (head < _data.length) {
            if (_data[head] === undefined) {
                head++;
            } else if (_data[tail] === undefined) {
                _data[tail] = _data[head];
                delete _data[head];
                head++;
                tail++;
            } else if (tail < head) {
                tail++;
            } else {
                head++;
                tail++;
            }
        }

        _data.length = tail;
    }
}
