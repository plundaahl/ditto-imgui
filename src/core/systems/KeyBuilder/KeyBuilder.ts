export interface KeyBuilder {
    push(keySuffix: string): void;
    getCurrentQualifiedKey(): string;
    pop(): void;
}

