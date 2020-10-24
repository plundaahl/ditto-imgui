import { FocusAction } from './FocusAction';

export class NextFocusAction implements FocusAction {

    constructor(
        private readonly setFocus: (element: string) => void,
    ) {}

    onSetFocusable(
        focusedElement: string | undefined,
        prevElement: string | undefined,
        curElement: string | undefined,
    ): void {
        if (!focusedElement || !prevElement || !curElement) {
            return;
        }

        if (focusedElement === prevElement) {
            this.setFocus(curElement);
        }
    }

    onPreRender(
        focusedElement: string | undefined,
        firstElement: string | undefined,
        lastElement: string | undefined,
    ): void {
        if (!focusedElement) {
            focusedElement = lastElement;
        }

        if (!firstElement || !lastElement) {
            return;
        }

        if (focusedElement === lastElement) {
            this.setFocus(firstElement);
        }
    }
}
