import { ObjectPool } from '../../../lib/ObjectPool';
import { KeyEntry, KeyboardKey, KeyboardCode } from './KeyEntry';
import { KeyboardEventSource } from './KeyboardEventSource';
import { KeyboardService } from './KeyboardService';

export class KeyboardServiceImpl implements KeyboardService {

    private readonly keysDown: KeyEntry[] = [];
    private readonly keysUp: KeyEntry[] = [];
    private readonly keysPressed: KeyEntry[] = [];

    constructor(
        private readonly keyEntryPool: ObjectPool<KeyEntry>,
        keyboardEventSource: KeyboardEventSource,
    ) {
        this.isKeyDown = this.isKeyDown.bind(this);
        this.isKeyUp = this.isKeyUp.bind(this);
        this.isKeyEntered = this.isKeyEntered.bind(this);
        this.isCodeDown = this.isCodeDown.bind(this);
        this.isCodeUp = this.isCodeUp.bind(this);
        this.isCodeEntered = this.isCodeEntered.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.onKeyPressed = this.onKeyPressed.bind(this);
        this.onPreRender = this.onPreRender.bind(this);

        keyboardEventSource.addEventListener('keydown', this.onKeyDown);
        keyboardEventSource.addEventListener('keyup', this.onKeyUp);
        keyboardEventSource.addEventListener('keypress', this.onKeyPressed);
    }

    isKeyDown(key: KeyboardKey): boolean {
        for (const entry of this.keysDown) {
            if (entry.key === key) {
                return true;
            }
        }
        return false;
    }

    isKeyUp(key: KeyboardKey): boolean {
        return !this.isKeyDown(key);
    }

    isKeyEntered(key: KeyboardKey): boolean {
        for (const entry of this.keysPressed) {
            if (entry.key === key) {
                return true;
            }
        }
        return false;
    }

    isCodeDown(code: KeyboardCode): boolean {
        for (const entry of this.keysDown) {
            if (entry.code === code) {
                return true;
            }
        }
        return false;
    }

    isCodeUp(code: KeyboardCode): boolean {
        for (const entry of this.keysDown) {
            if (entry.code === code) {
                return false;
            }
        }
        return true;
    }

    isCodeEntered(code: KeyboardCode): boolean {
        for (const entry of this.keysPressed) {
            if (entry.code === code) {
                return true;
            }
        }
        return false;
    }

    onPreRender(): void {
        const { keysUp, keysPressed, keyEntryPool } = this;

        for (const key of keysUp) {
            keyEntryPool.release(key);
        }

        for (const key of keysPressed) {
            keyEntryPool.release(key);
        }

        keysUp.length = 0;
        keysPressed.length = 0;
    }

    private onKeyDown(event: KeyboardEvent): void {
        const key = this.keyEntryPool.provision();
        key.key = event.key;
        key.code = event.code;
        this.keysDown.push(key);
    }

    private onKeyUp(event: KeyboardEvent): void {
        const { keysDown } = this;

        for (let i = 0; i < keysDown.length; i++) {
            if (keysDown[i].code !== event.code) {
                continue;
            }


            this.keysUp.push(keysDown[i]);
            keysDown[i] = keysDown[keysDown.length - 1];
            keysDown.length--;

            return;
        }
    }

    private onKeyPressed(event: KeyboardEvent): void {
        const key = this.keyEntryPool.provision();
        key.key = event.key;
        key.code = event.code;
        this.keysPressed.push(key);
    }
}
