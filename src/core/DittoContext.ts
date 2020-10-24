import { ServiceAPI } from './ServiceManager';
import { ControllerAPI } from './ControllerManager';

export interface DittoContext extends ServiceAPI {
    action: ControllerAPI,
}

