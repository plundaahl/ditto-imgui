import { UiElement } from '../../../../types';

export interface FocusAction {
    onSetFocusable(
        focusedElement: string | undefined,
        prevElement: UiElement | undefined,
        curElement: UiElement | undefined,
    ): void;

    onPreRender(
        focusedElement: string | undefined,
        firstElement: UiElement | undefined,
        lastElement: UiElement | undefined,
    ): void;
}
