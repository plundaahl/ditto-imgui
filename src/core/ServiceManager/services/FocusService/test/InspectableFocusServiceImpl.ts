import { UiElement } from '../../../../types';
import { FocusAction } from '../FocusAction';
import { FocusServiceImpl } from '../FocusServiceImpl';

export class InspectableFocusServiceImpl extends FocusServiceImpl {
    getElementStack(): UiElement[] {
        return this.elementStack;
    }

    getPrevFocusableElement(): string | undefined {
        return this.prevFocusableElement;
    }

    getCurrentElement(): UiElement | undefined {
        return this.currentElement;
    }

    getFocusableElements(): string[] {
        return [ ...this.focusableElements ];
    }

    getCurrentlyFocusedElement(): string | undefined {
        return this.focusedElement;
    }

    getNextElementToFocusOn(): string | undefined {
        return this.nextElementToFocus;
    }

    getAction(): FocusAction | undefined {
        return this.action;
    }
}
