import { KeyService } from './KeyService';

export class KeyServiceImpl implements KeyService {
    private keyStack: string[] = [];

    constructor() {
        this.push = this.push.bind(this);
        this.pop = this.pop.bind(this);
        this.getCurrentQualifiedKey = this.getCurrentQualifiedKey.bind(this);
    }

    push(keySuffix: string): void {
        if (!keySuffix || keySuffix.includes('/')) {
            throw new Error('keys cannot be empty strings or contain "/" characters');
        }

        const { keyStack } = this;
        const parent = keyStack[keyStack.length - 1];

        if (parent) {
            keyStack.push(parent + '/' + keySuffix);
        } else {
            keyStack.push(keySuffix);
        }
    }

    getCurrentQualifiedKey(): string {
        const key = this.keyStack[this.keyStack.length - 1];
        if (!key) {
            throw new Error('No key currently pushed');
        }
        return key;
    }

    pop(): void {
        const poppedKey = this.keyStack.pop();
        if (poppedKey === undefined) {
            throw new Error('No key currently pushed');
        }
    }
}
