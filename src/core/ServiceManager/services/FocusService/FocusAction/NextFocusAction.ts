import { UiElement } from '../../../../types';
import { FocusAction } from './FocusAction';

export class NextFocusAction implements FocusAction {

    constructor(
        private readonly setFocus: (element: UiElement) => void,
    ) {}

    onSetFocusable(
        focusedElement: string | undefined,
        prevElement: UiElement | undefined,
        curElement: UiElement | undefined,
    ): void {
        if (!focusedElement || !prevElement || !curElement) {
            return;
        }

        if (focusedElement === prevElement.key) {
            this.setFocus(curElement);
        }
    }

    onPreRender(
        focusedElement: string | undefined,
        firstElement: UiElement | undefined,
        lastElement: UiElement | undefined,
    ): void {
        if (!focusedElement) {
            focusedElement = lastElement && lastElement.key;
        }

        if (!firstElement || !lastElement) {
            return;
        }

        if (focusedElement === lastElement.key) {
            this.setFocus(firstElement);
        }
    }
}
