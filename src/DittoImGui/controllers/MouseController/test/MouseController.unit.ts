import { MouseController } from '../MouseController';
import { MouseCPI } from '../../../services/MouseService';
import { FocusCPI } from '../../../services/FocusService';

interface MouseSetters {
    setDragX: (val: number) => void,
    setDragY: (val: number) => void,
    setHoversElement: (val: boolean) => void,
    setM1Down: (val: boolean) => void,
    setM2Down: (val: boolean) => void,
}

function createMockMouseApi(): [MouseCPI, MouseSetters] {
    let mouseX = 0;
    let mouseY = 0;
    let dragX = 0;
    let dragY = 0;
    let hoversElement: boolean = false;
    let isM1Down: boolean = false;
    let isM2Down: boolean = false;

    return [{
        get mouseX() { return mouseX },
        get mouseY() { return mouseY },
        get dragX() { return dragX },
        get dragY() { return dragY },
        hoversElement: () => hoversElement,
        hoversChild: () => false,
        hoversFloatingChild: () => false,
        isM1Down: () => isM1Down,
        isM2Down: () => isM2Down,
        isM1Clicked: () => false,
        isM1DoubleClicked: () => false,
        isM1Dragged: () => false,
        isM2Clicked: () => false,
    }, {
        setDragX: (val: number) => dragX = val,
        setDragY: (val: number) => dragY = val,
        setHoversElement: (val: boolean) => { hoversElement = val; },
        setM1Down: (val: boolean) => isM1Down = val,
        setM2Down: (val: boolean) => isM2Down = val,
    }];
}

interface FocusSetters {
    setElementFocused(val: boolean): void,
    setChildFocused(val: boolean): void,
    setFloatChildFocused(val: boolean): void,
    setFocusChanged(val: boolean): void,
    setFocusable(val: boolean): void,
}

function createMockFocusCpi(): [FocusCPI, FocusSetters] {
    let elementFocused: boolean = false;
    let childFocused: boolean = false;
    let floatChildFocused: boolean = false;
    let focusChanged: boolean = false;
    let focusable: boolean = false;

    return [{
        isElementFocused: () => elementFocused,
        isChildFocused: () => childFocused,
        isFloatingChildFocused: () => floatChildFocused,
        didFocusChange: () => focusChanged,
        isFocusable: () => focusable,
        focusElement: jest.fn(),
        blurAllElements: jest.fn(),
    }, {
        setElementFocused: (val: boolean) => elementFocused = val,
        setChildFocused: (val: boolean) => childFocused = val,
        setFloatChildFocused: (val: boolean) => floatChildFocused = val,
        setFocusChanged: (val: boolean) => focusChanged = val,
        setFocusable: (val: boolean) => { focusable = val; },
    }];
}

let mouseSetters: MouseSetters;
let mouse: MouseCPI;
let focusSetters: FocusSetters;
let focus: FocusCPI;
let instance: MouseController;

beforeEach(() => {
    [mouse, mouseSetters] = createMockMouseApi();
    [focus, focusSetters] = createMockFocusCpi();
    instance = new MouseController(mouse, focus);
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
        beforeEach(() => { mouseSetters[setter](233); });

        test('should return 0', () => {
            expect(instance[method]()).toBe(0);
        });
    });

    describe('Given mouse is dragged', () => {
        const value = 123;

        beforeEach(() => {
            mouseSetters[setter](value);
            mouse.isM1Dragged = () => true;
        });

        test(`should return value of mouse.${mouseProp}`, () => {
            expect(instance[method]()).toBe(value);
        });
    });
});

describe('clicking to unfocus', () => {
    test('clicking on empty space should blur', () => {
        focusSetters.setFocusable(true);
        focusSetters.setElementFocused(true);
        mouseSetters.setHoversElement(false);
        instance.onBeginElement();

        mouseSetters.setM1Down(true);
        instance.onPreRender();

        expect(focus.blurAllElements).toHaveBeenCalled();
    });

    test('clicking a non-focusable element should blur', () => {
        focusSetters.setFocusable(true);
        focusSetters.setElementFocused(true);
        mouseSetters.setHoversElement(false);
        instance.onBeginElement();

        focusSetters.setFocusable(true);
        focusSetters.setElementFocused(false);
        mouseSetters.setHoversElement(false);
        instance.onBeginElement();

        focusSetters.setFocusable(false);
        mouseSetters.setHoversElement(true);
        instance.onBeginElement();

        mouseSetters.setM1Down(true);
        instance.onPreRender();

        expect(focus.blurAllElements).toHaveBeenCalled();
    });

    test('clicking a focusable element should not blur', () => {
        focusSetters.setFocusable(true);
        mouseSetters.setHoversElement(true);
        instance.onBeginElement();

        mouseSetters.setM1Down(true);
        instance.onPreRender();

        expect(focus.blurAllElements).not.toHaveBeenCalled();
    });
});
