import { createDummyController } from '../../test/helpers/createDummyController';
import { ServiceCPI } from '../../services';
import { Controller } from '../Controller';
import { ControllerManager } from '../ControllerManager';
import { ControllerManagerImpl } from '../ControllerManagerImpl';

let serviceManager: ServiceCPI;
let instance: ControllerManager;
let controllerA: Controller;
let controllerB: Controller;
let controllerC: Controller;

beforeEach(() => {
    serviceManager = {
        mouse: {
            getMouseX: () => 0,
            getMouseY: () => 0,
            getDragX: () => 0,
            getDragY: () => 0,
            hoversElement: jest.fn(),
            hoversChild: jest.fn(),
            hoversFloatingChild: jest.fn(),
            isM1Down: jest.fn(),
            isM2Down: jest.fn(),
            isM1Clicked: jest.fn(),
            isM1DoubleClicked: jest.fn(),
            isM1Dragged: jest.fn(),
            isM2Clicked: jest.fn(),
        },
        focus: {
            isElementFocused: jest.fn(),
            isChildFocused: jest.fn(),
            isFloatingChildFocused: jest.fn(),
            didFocusChange: jest.fn(),
            focusElement: jest.fn(),
            isFocusable: jest.fn(),
            blurAllElements: jest.fn(),
        },
        keyboard: {
            isCharDown: jest.fn(),
            isCharUp: jest.fn(),
            isCharPressed: jest.fn(),
            isKeyDown: jest.fn(),
            isKeyUp: jest.fn(),
            isKeyPressed: jest.fn(),
            getBufferedText: jest.fn(),
        },
        bounds: {
            getElementBounds: jest.fn(),
            getChildBounds: jest.fn(),
        },
    };

    controllerA = createDummyController();
    controllerB = createDummyController();
    controllerC = createDummyController();

    delete controllerC.onEndLayer;
    delete controllerC.onBeginLayer;
    delete controllerC.onEndElement;
    delete controllerC.onBeginElement;
    delete controllerC.onPreRender;
    delete controllerC.onPostRender;

    instance = new ControllerManagerImpl(
        serviceManager,
        { createController: () => controllerA },
        { createController: () => controllerB },
        { createController: () => controllerC },
    );
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

describe.each([
    'onBeginElement',
    'onEndElement',
    'onBeginLayer',
    'onEndLayer',
    'onPreRender',
    'onPostRender',
])('%s', (
    hook: 'onBeginElement'
        | 'onEndElement'
        | 'onBeginLayer'
        | 'onEndLayer'
        | 'onPreRender'
        | 'onPostRender'
    ) => {

    test('When hook is called on instance, calls hook on all controllers with hook', () => {
        instance[hook]();
        expect(controllerA[hook]).toHaveBeenCalled();
        expect(controllerB[hook]).toHaveBeenCalled();
    });
});
