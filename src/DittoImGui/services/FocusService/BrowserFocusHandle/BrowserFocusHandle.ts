export interface BrowserFocusHandle {
    isAppFocused(): boolean;
    focusApp(): void;
    setIsFocusedOnLastElement(isFocusedOnLastElement: boolean): void;
    setIsFocusedOnFirstElement(isFocusedOnfirstElement: boolean): void;
    onAppFocus(fn: () => void): void;
    onAppBlur(fn: () => void): void;
}
