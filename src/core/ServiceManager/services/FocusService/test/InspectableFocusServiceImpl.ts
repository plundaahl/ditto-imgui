import { UiElement } from '../../../../types';
import { FocusAction } from '../FocusAction';
import { FocusServiceImpl } from '../FocusServiceImpl';

export class InspectableFocusServiceImpl extends FocusServiceImpl {
    getElementStack(): UiElement[] {
        return this.elementStack;
    }

    getPrevFocusableElement(): UiElement | undefined {
        return this.prevFocusableElement;
    }

    getCurrentElement(): UiElement | undefined {
        return this.currentElement;
    }

    getFocusableElements(): UiElement[] {
        return [ ...this.focusableElements ];
    }

    getCurrentlyFocusedElement(): string | undefined {
        return this.focusedElement;
    }

    getNextElementToFocusOn(): UiElement | undefined {
        return this.nextElementToFocus;
    }

    getAction(): FocusAction | undefined {
        return this.action;
    }
}
