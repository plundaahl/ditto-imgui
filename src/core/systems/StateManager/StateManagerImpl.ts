import { StateHandle } from './StateHandle';
import { StateHandleImpl } from './StateHandleImpl';
import { StateManager } from './StateManager';

interface StateNode {
    _children: { [key: string]: StateNode };
    [key: string]: any;
}

export class StateManagerImpl implements StateManager {

    private handlerKeys: Set<string> = new Set();
    protected stateStore: StateNode = { _children: {} };
    protected stateStack: StateNode[] = [];

    constructor() {
        this.initDefaultState = this.initDefaultState.bind(this);
        this.getState = this.getState.bind(this);
        this.stateStack.push(this.stateStore);
    }

    protected get currentStateNode(): StateNode {
        return this.stateStack[this.stateStack.length - 1];
    }

    onBeginKey(key: string): void {
        const currentChildren = this.currentStateNode._children;

        if (!currentChildren[key]) {
            currentChildren[key] = { _children: {} };
        }

        this.stateStack.push(currentChildren[key]);
    }

    onEndKey(): void {
        if (this.stateStack.length === 1) {
            throw new Error(`Attempting to pop from empty keyStack`);
        }
        this.stateStack.pop();
    }

    createHandle<T extends {}>(handleKey: string): StateHandle<T> {
        if (this.handlerKeys.has(handleKey)) {
            throw new Error(
                `You called createHandle with a duplicate key ${handleKey}`
            );
        }
        this.handlerKeys.add(handleKey);

        return new StateHandleImpl<T>(
            handleKey,
            this.initDefaultState,
            this.getState,
        );
    }

    protected initDefaultState<T extends {}>(
        key: string,
        defaultState: T,
    ): void {
        const node = (this.currentStateNode as any);
        if (!node[key]) {
            node[key] = JSON.parse(JSON.stringify(defaultState));
        }
    }

    protected getState<T extends {}>(
        key: string,
    ): T {
        const record = (this.currentStateNode as any)[key];
        if (!record) {
            throw new Error(`No record registered for key ${key}`);
        }
        return record;
    }
}

