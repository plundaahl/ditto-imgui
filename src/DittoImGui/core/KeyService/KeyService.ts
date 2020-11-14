export interface KeyService {
    push(keySuffix: string): void;
    getCurrentQualifiedKey(): string;
    pop(): void;
}

