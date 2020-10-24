import { StateHandle } from './StateHandle';

export interface StateAPI {
    createHandle<T extends {}>(handleKey: string): StateHandle<T>;
}

export interface StateCPI {}

export interface StateService extends StateAPI, StateCPI {
    onBeginKey(key: string): void;
    onEndKey(): void;
}

