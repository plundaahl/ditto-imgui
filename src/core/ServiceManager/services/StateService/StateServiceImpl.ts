import { UiElement } from '../../../types';
import { StateHandle } from './StateHandle';
import { StateHandleImpl } from './StateHandleImpl';
import { StateService } from './StateService';

interface StateNode {
    _children: { [key: string]: StateNode };
    [key: string]: any;
}

export class StateServiceImpl implements StateService {

    private handlerKeys: Set<string> = new Set();
    protected stateStore: StateNode = { _children: {} };
    protected stateStack: StateNode[] = [];

    constructor() {
        this.onBeginElement = this.onBeginElement.bind(this);
        this.onEndElement = this.onEndElement.bind(this);
        this.declareAndGetState = this.declareAndGetState.bind(this);
        this.stateStack.push(this.stateStore);
    }

    protected get currentStateNode(): StateNode {
        return this.stateStack[this.stateStack.length - 1];
    }

    onBeginElement(element: UiElement): void {
        const { key } = element;
        const currentChildren = this.currentStateNode._children;

        if (!currentChildren[key]) {
            currentChildren[key] = { _children: {} };
        }

        this.stateStack.push(currentChildren[key]);
    }

    onEndElement(): void {
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
            this.declareAndGetState,
        );
    }

    protected declareAndGetState<T extends {}>(
        key: string,
        defaultState: T,
    ): T {
        const node = (this.currentStateNode as any);
        if (!node[key]) {
            node[key] = JSON.parse(JSON.stringify(defaultState));
        }
        return node[key];
    }
}

