import { StateServiceImpl } from '../StateServiceImpl';

export class InspectableStateService extends StateServiceImpl {

    getStateStack() { return this.stateStack; }
    getCurrentStateNode() { return this.currentStateNode; }

    doDeclareAndGetState<T extends {}>(key: string, defaultState: T): T {
        return this.declareAndGetState(key, defaultState);
    }
}
