import { Controller } from '../../../ControllerManager';
import { MouseController } from '../MouseController';
import { MouseAPI } from '../../../../ServiceManager/services/MouseService';

interface Setters {
    setDragX: (val: number) => void,
    setDragY: (val: number) => void,
}

function createMockMouseApi(): [MouseAPI, Setters] {
    let dragX = 0;
    let dragY = 0;

    return [{
        get dragX() { return dragX },
        get dragY() { return dragY },
        hoversElement: () => false,
        hoversChild: () => false,
        hoversFloatingChild: () => false,
        isM1Down: () => false,
        isM2Down: () => false,
        isM1Clicked: () => false,
        isM1DoubleClicked: () => false,
        isM1Dragged: () => false,
        isM2Clicked: () => false,
    }, {
        setDragX: (val: number) => dragX = val,
        setDragY: (val: number) => dragY = val,
    }];
}

let setters: Setters;
let mouse: MouseAPI;
let instance: Controller;

beforeEach(() => {
    [mouse, setters] = createMockMouseApi();
    instance = new MouseController(mouse);
});

describe('isElementHighlighted', () => {
    describe('Given mouse does not hover element', () => {
        test('returns false', () => {
            expect(instance.isElementHighlighted()).toBe(false);
        });
    });

    describe('Given mouse hovers element', () => {
        test('returns false', () => {
            expect(instance.isElementHighlighted()).toBe(false);
        });
    });
});

describe.each([
    ['isElementReadied', 'isM1Down'],
    ['isElementTriggered', 'isM1Clicked'],
    ['isElementToggled', 'isM1DoubleClicked'],
    ['isElementQueried', 'isM2Clicked'],
    ['isElementDragged', 'isM1Dragged'],
])('%s', (
    method: 'isElementReadied' | 'isElementToggled' | 'isElementTriggered' | 'isElementQueried' | 'isElementDragged',
    extraMouseApiMethod: 'isM1Down' | 'isM1Clicked' | 'isM1DoubleClicked' | 'isM2Clicked' | 'isM1Dragged',
) => {
    describe('Given mouse does not hover element', () => {
        describe(`And ${extraMouseApiMethod} returns false`, () => {
            test('should return false', () => {
                expect(instance[method]()).toBe(false);
            });
        });

        describe(`And ${extraMouseApiMethod} returns true`, () => {
            beforeEach(() => { mouse[extraMouseApiMethod] = () => true; });

            test('should return false', () => {
                expect(instance[method]()).toBe(false);
            });
        });
    });

    describe('Given mouse does not hover element', () => {
        beforeEach(() => { mouse.hoversElement = () => true; });

        describe(`And ${extraMouseApiMethod} returns false`, () => {
            test('should return false', () => {
                expect(instance[method]()).toBe(false);
            });
        });

        describe(`And ${extraMouseApiMethod} returns true`, () => {
            beforeEach(() => { mouse[extraMouseApiMethod] = () => true; });

            test('should return true', () => {
                expect(instance[method]()).toBe(true);
            });
        });
    });
});

describe('isElementInteracted', () => {
    describe('Given element is not hovered', () => {
        test('Should return false', () => {
            expect(instance.isElementInteracted()).toBe(false);
        });
    });

    describe('Given element is hovered', () => {
        beforeEach(() => { mouse.hoversElement = () => true; });

        describe('And M1 and M2 are both not down', () => {
            test('Should return false', () => {
                expect(instance.isElementInteracted()).toBe(false);
            });
        });

        describe('And M1 is down', () => {
            beforeEach(() => { mouse.isM1Down = () => true; });
            test('Should return true', () => {
                expect(instance.isElementInteracted()).toBe(true);
            });
        });

        describe('And M2 is down', () => {
            beforeEach(() => { mouse.isM2Down = () => true; });
            test('Should return true', () => {
                expect(instance.isElementInteracted()).toBe(true);
            });
        });
    });
});

describe('isChildInteracted', () => {
    describe('Given child is not hovered', () => {
        test('Should return false', () => {
            expect(instance.isChildInteracted()).toBe(false);
        });
    });

    describe('Given child is hovered', () => {
        beforeEach(() => { mouse.hoversChild = () => true; });

        describe('And M1 and M2 are both not down', () => {
            test('Should return false', () => {
                expect(instance.isChildInteracted()).toBe(false);
            });
        });

        describe('And M1 is down', () => {
            beforeEach(() => { mouse.isM1Down = () => true; });
            test('Should return true', () => {
                expect(instance.isChildInteracted()).toBe(true);
            });
        });

        describe('And M2 is down', () => {
            beforeEach(() => { mouse.isM2Down = () => true; });
            test('Should return true', () => {
                expect(instance.isChildInteracted()).toBe(true);
            });
        });
    });
});

describe('isFloatingChildInteracted', () => {
    describe('Given floating child is not hovered', () => {
        test('Should return false', () => {
            expect(instance.isFloatingChildInteracted()).toBe(false);
        });
    });

    describe('Given floating child is hovered', () => {
        beforeEach(() => { mouse.hoversFloatingChild = () => true; });

        describe('And M1 and M2 are both not down', () => {
            test('Should return false', () => {
                expect(instance.isFloatingChildInteracted()).toBe(false);
            });
        });

        describe('And M1 is down', () => {
            beforeEach(() => { mouse.isM1Down = () => true; });
            test('Should return true', () => {
                expect(instance.isFloatingChildInteracted()).toBe(true);
            });
        });

        describe('And M2 is down', () => {
            beforeEach(() => { mouse.isM2Down = () => true; });
            test('Should return true', () => {
                expect(instance.isFloatingChildInteracted()).toBe(true);
            });
        });
    });
});

describe.each([
    ['getDragX', 'dragX', 'setDragX'],
    ['getDragY', 'dragY', 'setDragY'],
])('%s', (
    method: 'getDragX' | 'getDragY',
    mouseProp: 'dragX' | 'dragY',
    setter: 'setDragX' | 'setDragY',
) => {
    describe('Given mouse is not dragged', () => {
        beforeEach(() => { setters[setter](233); });

        test('should return 0', () => {
            expect(instance[method]()).toBe(0);
        });
    });

    describe('Given mouse is dragged', () => {
        const value = 123;

        beforeEach(() => {
            setters[setter](value);
            mouse.isM1Dragged = () => true;
        });

        test(`should return value of mouse.${mouseProp}`, () => {
            expect(instance[method]()).toBe(value);
        });
    });
});
