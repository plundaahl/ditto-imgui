import { Hookable } from '../../infrastructure/HookRunner';
import { StateComponentKey } from './StateComponentKey';

interface StateHookable extends Required<Pick<Hookable, 'onBeginElement' | 'onEndElement' | 'onPostRender'>> {}

export interface StateAPI {
    getStateComponent<T>(
        key: StateComponentKey<T>,
        initValue?: T,
    ): T;
}

export interface StateCPI {}

export interface StateService extends StateHookable, StateAPI, StateCPI {}
