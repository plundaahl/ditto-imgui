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

    doForEachElementDfs(callback: (element: UiElement) => void): void {
        this.forEachElementDfs(callback);
    }
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

    describe('base functionality', () => {
        beforeEach(() => {
            parent = instance.getCurElement();
            instance.beginElement();
            child = instance.getCurElement();
        });
    
        test('Should error if removes root element', () => {
            instance.endElement();
            expect(() => instance.endElement()).toThrowError();
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

    describe('Interaction with standard elements', () => {
        test('Should error if called with mismatched beginElement', () => {
            instance.beginElement();
            expect(() => instance.endFloatingElement()).toThrowError();
        });
    });
});


describe('beginFloatingElement()', () => {
    let prevUiElement: UiElement;

    beforeEach(() => {
        prevUiElement = instance.getCurElement();
    });

    test("Should push a new element into previous element's floatingChildren", () => {
        const nPrevChildren = prevUiElement.floatingChildren.length;
        instance.beginFloatingElement();
        expect(prevUiElement.floatingChildren.length).toBe(nPrevChildren + 1);
    });

    test("Should change current element", () => {
        instance.beginFloatingElement();
        expect(instance.getCurElement()).not.toBe(prevUiElement);
    });

    test("Should push new element onto navigationStack", () => {
        instance.beginFloatingElement();
        const navStack = instance.getNavigationStack();
        expect(navStack[navStack.length - 1]).not.toBe(prevUiElement);
    });

    describe('postconditions', () => {
        beforeEach(() => instance.beginFloatingElement());

        test('curUiElement should be on end of navigationStack', () => {
            const navStack = instance.getNavigationStack();
            expect(navStack[navStack.length - 1]).toBe(instance.getCurElement());
        });

        test('curUiElement should be the same as last child of prev element', () => {
            const { floatingChildren } = prevUiElement;
            expect(instance.getCurElement())
                .toBe(floatingChildren[floatingChildren.length - 1]);
        });

        test('Last child of prev element should be on end of navigationStack', () => {
            const navStack = instance.getNavigationStack();
            const { floatingChildren } = prevUiElement;
            expect(navStack[navStack.length - 1])
                .toBe(floatingChildren[floatingChildren.length - 1]);
        });
    });
});


describe('endFloatingElement()', () => {
    let parent: UiElement;
    let child: UiElement;

    describe('Base functionality', () => {
        beforeEach(() => {
            parent = instance.getCurElement();
            instance.beginFloatingElement();
            child = instance.getCurElement();
        });
    
        test('Should error if removes root element', () => {
            instance.endFloatingElement();
            expect(() => instance.endFloatingElement()).toThrowError();
        });
    
        test('Should not modify parent floatingChildren', () => {
            const parentChildrenLength = parent.floatingChildren.length;
            instance.endFloatingElement();
            expect(parent.floatingChildren.length).toBe(parentChildrenLength);
        });
    
        describe('postconditions', () => {
            beforeEach(() => instance.endFloatingElement());
    
            test("Should set curUiElement to previous parent", () => {
                expect(instance.getCurElement()).toBe(parent);
            });
    
            test("Should set top of navigation stack to parent", () => {
                const navStack = instance.getNavigationStack();
                expect(navStack[navStack.length - 1]).toBe(parent);
            });
        });
    });

    describe('Interaction with standard elements', () => {
        test('Should error if called with mismatched beginElement', () => {
            instance.beginElement();
            expect(() => instance.endFloatingElement()).toThrowError();
        });
    });
});


describe('forEachElementDfs()', () => {
    let elements: UiElement[];
    let output: UiElement[];

    function beginElement() {
        instance.beginElement();
        elements.push(instance.getCurElement());
    }

    function endElement() {
        instance.endElement();
    }

    beforeEach(() => {
        elements = [ instance.getCurElement() ];
        output = [];
    });

    test('visit every element', () => {
        {
            beginElement();
            {
                beginElement();
                endElement();

                beginElement();
                {
                    beginElement();
                    {
                        beginElement();
                        endElement();
                    }
                    endElement();
                }
                endElement();
            }
            endElement();

            beginElement();
            endElement();

            beginElement();
            {
                beginElement();
                endElement();
            }
            endElement();

            beginElement();
            endElement();
        }

        instance.doForEachElementDfs((e) => output.push(e));

        expect(output.length).toEqual(elements.length);
        for (let i = 0; i < elements.length; i++) {
            expect(output[i]).toBe(elements[i]);
        }
    });
});

