import { Controller } from './Controller';
import { ServiceCPI } from '../services';

export interface ControllerFactory {
    createController(services: ServiceCPI): Controller;
}
