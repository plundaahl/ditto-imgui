export interface KeyboardEventSource {
    addEventListener(eventType: string, fn: (event: KeyboardEvent) => void): void;
}
