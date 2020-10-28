import { Controller } from './Controller';

export interface ControllerAPI extends Controller {}
export interface ControllerService extends ControllerAPI {
    registerController(controller: Controller): void;
}
