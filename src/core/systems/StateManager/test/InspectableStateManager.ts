import { StateManagerImpl } from '../StateManagerImpl';

export class InspectableStateManager extends StateManagerImpl {

    getStateStack() { return this.stateStack; }
    getCurrentStateNode() { return this.currentStateNode; }

    doInitDefaultState<T extends {}>(key: string, defaultState: T) {
        this.initDefaultState(key, defaultState);
    }

    doGetState<T extends {}>(key: string): T {
        return this.getState(key);
    }
}
