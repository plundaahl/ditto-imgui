import { KeyboardEventSource } from './KeyboardEventSource';
import { KeyboardService, KeyboardKey, KeyboardChar } from './KeyboardService';

interface KeyData {
    lastChar?: string;
    isDown: boolean;
    isPressed: boolean;
    holdTimer: number;
}

interface Config {
    holdDelayInit: number;
    holdDelayRepeat: number;
}

export class KeyboardServiceImpl implements KeyboardService {
    private readonly charTable: { [char: string]: string } = {};
    private readonly keyTable: { [code: string]: KeyData } = {};
    private readonly keyPressBuffer: string[] = [];
    private enteredText: string = '';

    constructor(
        keyboardEventSource: KeyboardEventSource,
        private readonly config: Config = {
            holdDelayInit: 500,
            holdDelayRepeat: 30,
        },
    ) {
        this.isCharDown = this.isCharDown.bind(this);
        this.isCharUp = this.isCharUp.bind(this);
        this.isCharPressed = this.isCharPressed.bind(this);
        this.isKeyDown = this.isKeyDown.bind(this);
        this.isKeyUp = this.isKeyUp.bind(this);
        this.isKeyPressed = this.isKeyPressed.bind(this);
        this.getBufferedText = this.getBufferedText.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.onPreRender = this.onPreRender.bind(this);
        this.setAllKeysUp = this.setAllKeysUp.bind(this);

        keyboardEventSource.addEventListener('keydown', this.onKeyDown);
        keyboardEventSource.addEventListener('keyup', this.onKeyUp);

        if (window) {
            window.addEventListener('blur', this.setAllKeysUp);
        }
    }

    isCharDown(char: KeyboardChar): boolean {
        const keyEntry = this.keyTable[this.charTable[char]];
        return Boolean(
            keyEntry
            && keyEntry.lastChar === char
            && keyEntry.isDown
        );
    }

    isCharUp(char: KeyboardChar): boolean {
        return !this.isCharDown(char);
    }

    isCharPressed(char: KeyboardChar): boolean {
        const keyEntry = this.keyTable[this.charTable[char]];
        return Boolean(
            keyEntry
            && keyEntry.lastChar === char
            && keyEntry.isPressed
        );
    }

    isKeyDown(code: KeyboardKey): boolean {
        return Boolean(
            this.keyTable[code]?.isDown
        );
    }

    isKeyUp(code: KeyboardKey): boolean {
        return !this.isKeyDown(code);
    }

    isKeyPressed(code: KeyboardKey): boolean {
        return Boolean(
            this.keyTable[code]?.isPressed
        );
    }

    getBufferedText(): string {
        return this.enteredText;
    }

    onPreRender(frameTimeInMs: number): void {
        const {
            keyTable,
            keyPressBuffer,
            config: {
                holdDelayRepeat,
            }
        } = this;

        this.enteredText = '';

        for (const code in keyTable) {
            const codeEntry = keyTable[code];
            if (!codeEntry || !codeEntry.isDown) {
                continue
            }

            codeEntry.isPressed = false;    
            codeEntry.holdTimer -= frameTimeInMs;

            if (codeEntry.holdTimer <= 0) {
                codeEntry.holdTimer = (
                    codeEntry.holdTimer % holdDelayRepeat) + holdDelayRepeat;
                this.generateKeyPress(code);
            }
        }

        keyPressBuffer.sort((a, b) => keyTable[a].holdTimer - keyTable[b].holdTimer);

        for (const key of keyPressBuffer) {
            if (keyTable[key].lastChar) {
                this.enteredText += keyTable[key].lastChar;
            }
        }
        keyPressBuffer.length = 0;
    }

    private onKeyDown(event: KeyboardEvent): void {
        const { config: { holdDelayInit } } = this;
        const { key, code } = event;

        const keyEntry = this.getKeyEntry(code);
        keyEntry.isDown = true;
        keyEntry.holdTimer = holdDelayInit;
        this.generateKeyPress(code);

        if (key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey) {
            keyEntry.lastChar = key;
            this.charTable[key] = code;
        } else {
            delete keyEntry.lastChar;
        }
    }

    private generateKeyPress(key: string): void {
        const keyEntry = this.getKeyEntry(key);
        keyEntry.isPressed = true;
        this.keyPressBuffer.push(key);
    }

    private onKeyUp(event: KeyboardEvent): void {
        const codeTableEntry = this.getKeyEntry(event.code);
        codeTableEntry.isPressed = false;
        codeTableEntry.isDown = false;
        codeTableEntry.holdTimer = 0;
    }

    private getKeyEntry(code: string): KeyData {
        const { keyTable } = this;
        keyTable[code] = keyTable[code] || {
            isDown: false,
            isPressed: false,
            holdTimer: 0,
        };
        return keyTable[code];
    }

    private setAllKeysUp() {
        const { keyTable } = this;
        for (const key in keyTable) {
            const keyEntry = keyTable[key];
            keyEntry.isDown = false;
            keyEntry.isPressed = false;
            keyEntry.holdTimer = 0;
            delete keyEntry.lastChar;
        }
    }
}
