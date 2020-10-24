import { FocusAction } from './FocusAction';

export class PrevFocusAction implements FocusAction {

    constructor(
        private readonly setFocus: (element: string) => void,
    ) {}

    onSetFocusable(
        focusedElement: string | undefined,
        prevElement: string | undefined,
        curElement: string | undefined,
    ): void {
        if (!prevElement || !curElement) {
            return;
        }

        if (focusedElement === curElement) {
            this.setFocus(prevElement);
        }
    }

    onPreRender(
        focusedElement: string | undefined,
        firstElement: string | undefined,
        lastElement: string | undefined,
    ): void {
        if (!focusedElement) {
            focusedElement = firstElement;
        }

        if (!firstElement || !lastElement) {
            return;
        }

        if (focusedElement === firstElement) {
            this.setFocus(lastElement);
        }
    }
}
