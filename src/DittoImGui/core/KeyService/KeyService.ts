interface KeyShared {
    getElementKey(): string;
    getParentKey(): string | undefined;
}

export interface KeyAPI extends KeyShared {}

export interface KeyCPI {}

export interface KeyService extends KeyAPI, KeyCPI {
    push(keySuffix: string): void;
    getCurrentQualifiedKey(): string;
    pop(): void;
}

