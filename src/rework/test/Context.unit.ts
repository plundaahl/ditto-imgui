import { ContextImpl, Context } from '../Context';
import { UiElement } from '../UiElement';

class InspectableContext extends ContextImpl {
    constructor() {
        super(createFakeCanvasCtx);
    }

    getUiElementPool() { return this.elementPool; }
    getUiElementTree() { return this.elementTree; }
    getBuildStack() { return this.buildStack; }
    getCurElement() { return this.curElement; }

    doForEachElementDfs(callback: (element: UiElement) => void): void {
        this.forEachElementDfs(callback);
    }
}

function createFakeCanvasCtx(hooks: {
    onCall?: (fnCalled: string, ...args: any) => void,
    onGet?: (prop: string) => void,
    onSet?: (prop: string, value: any) => void,
} = {}) {
    const onCall = hooks.onCall || jest.fn();
    const onGet = hooks.onGet || jest.fn();
    const onSet = hooks.onSet || jest.fn();

    return new Proxy({}, {
        get: (target: {}, prop: string) => {
            onGet(prop);
            return onCall.bind(undefined, prop);
        },
        set: (target: {}, prop: string, value: any) => {
            onSet(prop, value);
            return true;
        },
    }) as CanvasRenderingContext2D;
}

let instance: InspectableContext;
beforeEach(() => { instance = new InspectableContext(); });

describe('constructor', () => {
    test('sets first element in nav stack to root of elementTree', () => {
        expect(instance.getBuildStack()[0]).toBe(instance.getUiElementTree());
    });

    test('sets navigationStack length to 1', () => {
        expect(instance.getBuildStack().length).toBe(1);
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
        const navStack = instance.getBuildStack();
        expect(navStack[navStack.length - 1]).not.toBe(prevUiElement);
    });

    describe('postconditions', () => {
        beforeEach(() => instance.beginElement());

        test('curUiElement should be on end of navigationStack', () => {
            const navStack = instance.getBuildStack();
            expect(navStack[navStack.length - 1]).toBe(instance.getCurElement());
        });

        test('curUiElement should be the same as last child of prev element', () => {
            expect(instance.getCurElement())
                .toBe(prevUiElement.children[prevUiElement.children.length - 1]);
        });

        test('Last child of prev element should be on end of navigationStack', () => {
            const navStack = instance.getBuildStack();
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
                const navStack = instance.getBuildStack();
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

    
    test('can rearrange children in callback before iterating through them', () => {
        const parent = instance.getCurElement();
        const children: UiElement[] = [];

        {
            beginElement();
            children.push(instance.getCurElement());
            endElement();

            beginElement();
            children.push(instance.getCurElement());
            endElement();

            beginElement();
            children.push(instance.getCurElement());
            endElement();
        }

        const expectedOrder = [ parent, ...children.reverse() ];
        let output: UiElement[] = [];

        instance.doForEachElementDfs((e) => {
            const [ ...children ] = e.children;
            e.children.length = 0;
            e.children.push(...children.reverse());
            output.push(e)
        });

        expect(output.length).toEqual(expectedOrder.length);
        for (let i = 0; i < output.length; i++) {
            expect(output[i]).toBe(expectedOrder[i]);
        }
    });
});

