import { StateManagerImpl } from '../StateManagerImpl';

export class InspectableStateManager extends StateManagerImpl {

    getStateStack() { return this.stateStack; }
    getCurrentStateNode() { return this.currentStateNode; }

    doDeclareAndGetState<T extends {}>(key: string, defaultState: T): T {
        return this.declareAndGetState(key, defaultState);
    }
}
