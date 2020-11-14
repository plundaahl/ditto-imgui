import { BrowserFocusHandle, BrowserFocusHandleImpl } from '../BrowserFocusHandle';

interface FocusableHtmlElement {
    focus(): void;
    addEventListener(event: string, fn: (e: Event) => void): void;
    setAttribute(attr: string, value: any): void;
    removeAttribute(attr: string): void;
}

function createFakeInput(): FocusableHtmlElement {
    return {
        focus: jest.fn(),
        addEventListener: jest.fn(),
        setAttribute: jest.fn(),
        removeAttribute: jest.fn(),
    }
}

export function createTestBrowserFocusHandle(): BrowserFocusHandle {
    return new BrowserFocusHandleImpl(
        createFakeInput(),
        createFakeInput(),
        createFakeInput(),
        createFakeInput(),
    );
}
