import { Controller } from '..';
import { ServiceCPI } from '../../services';
import { ControllerFactory } from '../ControllerFactory';
import { MouseController } from './MouseController';

export class MouseControllerFactory implements ControllerFactory {
    createController(services: ServiceCPI): Controller {
        return new MouseController(services.mouse);
    }
}
