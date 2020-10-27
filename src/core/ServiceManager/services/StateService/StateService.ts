import { Hookable } from '../../../HookRunner';
import { UiElement } from '../../../types';
import { StateHandle } from './StateHandle';

export interface StateAPI {
    createHandle<T extends {}>(handleKey: string): StateHandle<T>;
}

export interface StateCPI {}

export interface StateService extends StateAPI, StateCPI, Hookable {
    onBeginElement(element: UiElement): void;
    onEndElement(): void;
}

