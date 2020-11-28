import { StateService } from './StateService';
import { StateComponentKey } from './StateComponentKey';
import { UiElement } from '../../types';
import { PERSISTENT } from '../../flags';

interface StateStore {
    [elementKey: string]: {
        [componentKeyName: string]: {}
    }
}

interface KeyLookup {
    [keyName: string]: StateComponentKey<any>,
}

export class StateServiceImpl implements StateService {
    private readonly registeredKeys: KeyLookup = {}; 
    private readonly stateStore: StateStore = {};
    private readonly persistantElements: Set<string> = new Set();
    private readonly elementsSeenThisFrame: Set<string> = new Set();
    private curElement: UiElement | undefined;

    constructor() {
        this.getStateComponent = this.getStateComponent.bind(this);
        this.registerStateComponentKey = this.registerStateComponentKey.bind(this);
        this.getCurElementState = this.getCurElementState.bind(this);
        this.getComponentForElement = this.getComponentForElement.bind(this);
        this.onBeginElement = this.onBeginElement.bind(this);
        this.onEndElement = this.onEndElement.bind(this);
        this.onPostRender = this.onPostRender.bind(this);
    }

    getStateComponent<T>(
        key: StateComponentKey<T>,
        initValue?: T,
    ): T {
        this.registerStateComponentKey(key);
        const elementState = this.getCurElementState();
        return this.getComponentForElement(elementState, key, initValue);
    }

    private registerStateComponentKey(key: StateComponentKey<any>): void {
        const { registeredKeys } = this;

        const keyName = key.getName();
        const existingKey = registeredKeys[keyName];

        if (!existingKey) {
            registeredKeys[keyName] = key;
        } else if (existingKey !== key) {
            throw new Error('Registered multiple keys with the same name.');
        }
    }

    private getCurElementState(): { [componentKeyName: string]: {} } {
        const { stateStore } = this;

        const element = this.curElement;
        if (!element) {
            throw new Error('No element active');
        }

        const elementKey = element.key;
        if (!stateStore[elementKey]) {
            stateStore[elementKey] = {};
        }
        return stateStore[elementKey];
    }

    private getComponentForElement<T>(
        elementState: { [componentKeyName: string]: {} },
        key: StateComponentKey<T>,
        initValue?: T,
    ): T {
        const componentKey = key.getName();
        if (!elementState[componentKey]) {
            elementState[componentKey] = initValue
                ? JSON.parse(JSON.stringify(initValue))
                : key.cloneDefaultInitState();
        }
        return elementState[componentKey] as T;
    }

    onBeginElement(element: UiElement): void {
        this.curElement = element;

        if (element.flags & PERSISTENT) {
            this.persistantElements.add(element.key);
        } else {
            this.persistantElements.delete(element.key);
        }

        this.elementsSeenThisFrame.add(element.key);
    }

    onEndElement(): void {
        this.curElement = this.curElement && this.curElement.parent;
    }

    onPostRender(): void {
        const {
            stateStore,
            elementsSeenThisFrame,
            persistantElements,
        } = this;

        for (const elementKey in stateStore) {
            if (elementsSeenThisFrame.has(elementKey)) {
                continue;
            }

            if (persistantElements.has(elementKey)) {
                continue;
            }

            delete stateStore[elementKey];
        }
        
        elementsSeenThisFrame.clear();
    }
}
