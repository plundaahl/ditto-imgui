export interface FocusAction {
    onSetFocusable(
        focusedElement: string | undefined,
        prevElement: string | undefined,
        curElement: string | undefined,
    ): void;

    onPostRender(
        focusedElement: string | undefined,
        firstElement: string | undefined,
        lastElement: string | undefined,
    ): void;
}
