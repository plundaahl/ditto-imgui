import { StateHandle } from './StateHandle';

export interface StateAPI {
    createHandle<T extends {}>(handleKey: string): StateHandle<T>;
}

export interface StateManager extends StateAPI {
    onBeginKey(key: string): void;
    onEndKey(): void;
}

