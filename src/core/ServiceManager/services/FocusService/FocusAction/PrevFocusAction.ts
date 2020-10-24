import { UiElement } from '../../../../types';
import { FocusAction } from './FocusAction';

export class PrevFocusAction implements FocusAction {

    constructor(
        private readonly setFocus: (element: UiElement) => void,
    ) {}

    onSetFocusable(
        focusedElement: string | undefined,
        prevElement: UiElement | undefined,
        curElement: UiElement | undefined,
    ): void {
        if (!prevElement || !curElement) {
            return;
        }

        if (focusedElement === curElement.key) {
            this.setFocus(prevElement);
        }
    }

    onPreRender(
        focusedElement: string | undefined,
        firstElement: UiElement | undefined,
        lastElement: UiElement | undefined,
    ): void {
        if (!focusedElement && firstElement) {
            focusedElement = firstElement.key;
        }

        if (!firstElement || !lastElement) {
            return;
        }

        if (focusedElement === firstElement.key) {
            this.setFocus(lastElement);
        }
    }
}
