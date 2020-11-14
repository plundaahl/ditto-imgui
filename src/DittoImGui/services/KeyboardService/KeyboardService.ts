import { Hookable } from '../../infrastructure/HookRunner';

export type KeyboardChar = string;
export type KeyboardKey = string;

interface KeyboardShared {
    isCharDown(char: KeyboardChar): boolean;
    isCharUp(char: KeyboardChar): boolean;
    isCharPressed(char: KeyboardChar): boolean;
    isKeyDown(key: KeyboardKey): boolean;
    isKeyUp(key: KeyboardKey): boolean;
    isKeyPressed(key: KeyboardKey): boolean;
    getBufferedText(): string;
}

export interface KeyboardAPI extends KeyboardShared {}

export interface KeyboardCPI extends KeyboardShared {}

export interface KeyboardService extends KeyboardAPI, KeyboardCPI, Hookable {
    onPreRender(frameTimeInMs: number): void;
}
