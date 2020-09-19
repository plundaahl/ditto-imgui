import { StateHandle, StateHandleImpl } from './StateHandle';

export interface StateManager {
    beginKey(key: string): void;
    endKey(): void;
    registerHandle<T extends {}>(handleKey: string): StateHandle<T>;
}

interface StateNode {
    _children: { [key: string]: StateNode };
    [key: string]: any;
}

export class StateManagerImpl implements StateManager {

    private handlerKeys: Set<string> = new Set();
    protected stateStore: StateNode = { _children: {} };
    protected stateStack: StateNode[] = [];

    constructor() {
        this.registerRecord = this.registerRecord.bind(this);
        this.getRecord = this.getRecord.bind(this);
        this.stateStack.push(this.stateStore);
    }

    protected get currentStateNode(): StateNode {
        return this.stateStack[this.stateStack.length - 1];
    }

    beginKey(key: string): void {
        const currentChildren = this.currentStateNode._children;

        if (!currentChildren[key]) {
            currentChildren[key] = { _children: {} };
        }

        this.stateStack.push(currentChildren[key]);
    }

    endKey(): void {
        if (this.stateStack.length === 1) {
            throw new Error(`Attempting to pop from empty keyStack`);
        }
        this.stateStack.pop();
    }

    registerHandle<T extends {}>(handleKey: string): StateHandle<T> {
        if (this.handlerKeys.has(handleKey)) {
            throw new Error(
                `You called registerHandle with a duplicate key ${handleKey}`
            );
        }
        this.handlerKeys.add(handleKey);

        return new StateHandleImpl<T>(
            handleKey,
            this.registerRecord,
            this.getRecord,
        );
    }

    protected registerRecord<T extends {}>(
        key: string,
        defaultState: T,
    ): void {
        const node = (this.currentStateNode as any);
        if (!node[key]) {
            node[key] = JSON.parse(JSON.stringify(defaultState));
        }
    }

    protected getRecord<T extends {}>(
        key: string,
    ): T {
        const record = (this.currentStateNode as any)[key];
        if (!record) {
            throw new Error(`No record registered for key ${key}`);
        }
        return record;
    }
}

