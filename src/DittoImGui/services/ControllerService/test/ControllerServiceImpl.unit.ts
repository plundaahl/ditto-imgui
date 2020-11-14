import { Controller } from '../Controller';
import { ControllerService } from '../ControllerService';
import { ControllerServiceImpl } from '../ControllerServiceImpl';
import { createDummyController } from '../../../test/helpers';

let instance: ControllerService;
let controllerA: Controller;
let controllerB: Controller;
let controllerC: Controller;

beforeEach(() => {
    instance = new ControllerServiceImpl();
    controllerA = createDummyController();
    controllerB = createDummyController();
    controllerC = createDummyController();

    instance.registerController(controllerA);
    instance.registerController(controllerB);
    instance.registerController(controllerC);
});

describe.each([
    'isElementHighlighted',
    'isElementReadied',
    'isElementTriggered',
    'isElementToggled',
    'isElementQueried',
    'isElementDragged',
    'isElementInteracted',
    'isChildInteracted',
    'isFloatingChildInteracted',
])(`%s`, (
    method: 'isElementHighlighted'
        | 'isElementReadied'
        | 'isElementToggled'
        | 'isElementTriggered'
        | 'isElementQueried'
        | 'isElementDragged'
        | 'isElementInteracted'
        | 'isChildInteracted'
        | 'isFloatingChildInteracted'
) => {
    test('If all controllers return false, calls each of them', () => {
        instance[method]();
        expect(controllerA[method]).toHaveBeenCalled();
        expect(controllerB[method]).toHaveBeenCalled();
        expect(controllerC[method]).toHaveBeenCalled();
    });

    test('When all controllers return false, returns false', () => {
        expect(instance[method]()).toBe(false);
    });

    test('When one of the controllers returns true, returns true', () => {
        controllerB[method] = () => true;
        expect(instance[method]()).toBe(true);
    });
});

describe.each([
    'getDragX',
    'getDragY',
])('%s', (method: 'getDragX' | 'getDragY') => {
    describe('Given no controller is dragged', () => {
        test(`${method} should return 0`, () => {
            expect(instance[method]()).toBe(0);
        });
    });

    describe('Given a controller is dragged', () => {
        let valueReturned: number;

        beforeEach(() => {
            valueReturned = 233;
            controllerB.isElementDragged = () => true;
            controllerB[method] = () => valueReturned;
        });

        test('Should return value of the first controller that isDragged', () => {
            expect(instance[method]()).toBe(valueReturned);
        });
    });
});
