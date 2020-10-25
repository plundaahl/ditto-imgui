import {
    KeyboardKey,
    KeyboardCode,
} from './KeyEntry';

interface KeyboardShared {
    isKeyDown(key: KeyboardKey): boolean;
    isKeyUp(key: KeyboardKey): boolean;
    isKeyEntered(key: KeyboardKey): boolean;
    isCodeDown(key: KeyboardCode): boolean;
    isCodeUp(key: KeyboardCode): boolean;
    isCodeEntered(key: KeyboardCode): boolean;
}

export interface KeyboardAPI extends KeyboardShared {}

export interface KeyboardCPI extends KeyboardShared {}

export interface KeyboardService extends KeyboardAPI, KeyboardCPI {
    onPreRender(): void;
}
