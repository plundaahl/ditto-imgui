import { ContextImpl, Context } from '../Context';
import { UiElement } from '../UiElement';

class InspectableContext extends ContextImpl {
    constructor() {
        super(createFakeCanvasCtx);
    }

    getUiElementPool() { return this.elementPool; }
    getUiElementTree() { return this.elementTree; }
    getNavigationStack() { return this.navigationStack; }
    getCurElement() { return this.curElement; }
}

function createFakeCanvasCtx() {
    return {} as CanvasRenderingContext2D;
}

let instance: InspectableContext;
beforeEach(() => { instance = new InspectableContext(); });

describe('constructor', () => {
    test('sets first element in nav stack to root of elementTree', () => {
        expect(instance.getNavigationStack()[0]).toBe(instance.getUiElementTree());
    });

    test('sets navigationStack length to 1', () => {
        expect(instance.getNavigationStack().length).toBe(1);
    });

    test('sets cur element to root of elementTree', () => {
        expect(instance.getCurElement()).toBe(instance.getUiElementTree());
    });
});

describe('get draw()', () => {
    test("Returns current element's draw context", () => {
        expect(instance.draw).toBe(instance.getCurElement().drawBuffer);
    });
});

describe('get bounds()', () => {
    test("Returns current element's bounding box", () => {
        expect(instance.bounds).toBe(instance.getCurElement().boundingBox);
    });
});

describe('beginElement()', () => {
    let prevUiElement: UiElement;

    beforeEach(() => {
        prevUiElement = instance.getCurElement();
    });

    test("Should push a new element into previous element's children", () => {
        const nPrevChildren = prevUiElement.children.length;
        instance.beginElement();
        expect(prevUiElement.children.length).toBe(nPrevChildren + 1);
    });

    test("Should change current element", () => {
        instance.beginElement();
        expect(instance.getCurElement()).not.toBe(prevUiElement);
    });

    test("Should push new element onto navigationStack", () => {
        instance.beginElement();
        const navStack = instance.getNavigationStack();
        expect(navStack[navStack.length - 1]).not.toBe(prevUiElement);
    });

    describe('postconditions', () => {
        beforeEach(() => instance.beginElement());

        test('curUiElement should be on end of navigationStack', () => {
            const navStack = instance.getNavigationStack();
            expect(navStack[navStack.length - 1]).toBe(instance.getCurElement());
        });

        test('curUiElement should be the same as last child of prev element', () => {
            expect(instance.getCurElement())
                .toBe(prevUiElement.children[prevUiElement.children.length - 1]);
        });

        test('Last child of prev element should be on end of navigationStack', () => {
            const navStack = instance.getNavigationStack();
            expect(navStack[navStack.length - 1])
                .toBe(prevUiElement.children[prevUiElement.children.length - 1]);
        });
    });

    describe('onBeginChild hook', () => {
        beforeEach(() => prevUiElement.onBeginChild = jest.fn());

        test("Should call previous element's onBeginChild hook", () => {
            instance.beginElement();
            expect(prevUiElement.onBeginChild).toHaveBeenCalled();
        });

        test("Should pass self and child into previous element's onBeginChild hook", () => {
            instance.beginElement();
            expect(prevUiElement.onBeginChild)
                .toHaveBeenCalledWith(prevUiElement, instance.getCurElement());
        });
    });
});


describe('endElement()', () => {
    let parent: UiElement;
    let child: UiElement;

    beforeEach(() => {
        parent = instance.getCurElement();
        instance.beginElement();
        child = instance.getCurElement();
    });

    test('Should not modify parent children', () => {
        const parentChildrenLength = parent.children.length;
        instance.endElement();
        expect(parent.children.length).toBe(parentChildrenLength);
    });

    describe('postconditions', () => {
        beforeEach(() => instance.endElement());

        test("Should set curUiElement to previous parent", () => {
            expect(instance.getCurElement()).toBe(parent);
        });

        test("Should set top of navigation stack to parent", () => {
            const navStack = instance.getNavigationStack();
            expect(navStack[navStack.length - 1]).toBe(parent);
        });
    });

    describe('onEndChild hook', () => {
        beforeEach(() => parent.onEndChild = jest.fn());

        test("Should pass parent and child into parent's onEndChild", () => {
            instance.endElement();
            expect(parent.onEndChild).toHaveBeenCalled();
            expect(parent.onEndChild).toHaveBeenCalledWith(parent, child);
        });
    });
});

