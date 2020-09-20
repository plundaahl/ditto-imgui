import { ContextImpl } from '../Context';
import { UiElement } from '../UiElement';
import { StateManagerImpl, StateManager } from '../StateManager';

let stateManager: StateManager;
let instance: InspectableContext;

beforeEach(() => {
    stateManager = new StateManagerImpl();
    instance = new InspectableContext({
        createCanvasFn: createFakeCanvasCtx,
        stateManager,
    });
});

describe('constructor', () => {
    test('Creates an initial layer', () => {
        expect(instance.getLayers().length).toBe(1);
    });

    test.skip('sets first element in first build stack to root of current layer', () => {
        throw new Error('not implemented');
    });

    test('sets buildStack length to 1', () => {
        expect(instance.getBuildStack().length).toBe(1);
    });

    test("sets current layer's build stack length to 1", () => {
        expect(instance.getCurLayer().buildStack.length).toBe(1);
    });

    test("sets cur element to root of current layer", () => {
        expect(instance.getCurElement()).toBe(instance.getCurLayer().root);
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

describe('get curLayer', () => {
    test('Should return last element in buildStack', () => {
        const pool = instance.getUiElementPool();
        const buildStack = instance.getBuildStack();

        expect(instance.getCurLayer()).toBe(buildStack[buildStack.length - 1]);

        let layer = {
            root: pool.provision(),
            floats: [],
            buildStack: [],
        };
        buildStack.push(layer);
        expect(instance.getCurLayer()).toBe(layer);

        layer = {
            root: pool.provision(),
            floats: [],
            buildStack: [],
        };
        buildStack.push(layer);
        expect(instance.getCurLayer()).toBe(layer);
    });

    test('Should error if buildStack empty', () => {
        instance.getBuildStack().pop();
        expect(() => instance.getCurLayer()).toThrowError();
    });
});

describe('registerStateHandle()', () => {
    test('passes provdied key into stateManager.registerHandle', () => {
        const key = 'somekey';

        stateManager.registerHandle = jest.fn(stateManager.registerHandle) as any;
        instance.registerStateHandle<{}>(key);

        expect(stateManager.registerHandle).toHaveBeenCalledWith(key);
    });
});

describe('beginLayer()', () => {
    test('Should increment buildStack', () => {
        const buildStackLength = instance.getBuildStack().length;
        instance.beginLayer('somekey');
        expect(instance.getBuildStack().length).toBe(buildStackLength + 1);
    });

    test('New layer should have 1 element in buildStack', () => {
        instance.beginLayer('fooofofofof');
        expect(instance.getCurLayer().buildStack.length).toBe(1);
    });

    test("Should add new layer to layers array", () => {
        const nLayersAtStart = instance.getLayers().length;
        instance.beginLayer('fooofofofof');
        const nLayersAfterCall = instance.getLayers().length;
        expect(nLayersAfterCall).toBe(nLayersAtStart + 1);
    });

    test("Should call stateManager.beginElement()", () => {
        stateManager.beginKey = jest.fn(stateManager.beginKey);
        instance.beginLayer('fooofofofof');
        expect(stateManager.beginKey).toHaveBeenCalled();
    });

    test("Should call stateManager.beginElement()", () => {
        const key = 'akey';
        stateManager.beginKey = jest.fn(stateManager.beginKey);
        instance.beginLayer(key);
        expect(stateManager.beginKey).toHaveBeenCalledWith(key);
    });
});

describe('endLayer()', () => {
    test("Should error if current layer's buildStack has more than 1 element", () => {
        instance.beginLayer('fooofofofof');
        instance.beginElement('somekey');

        expect(instance.getCurLayer().buildStack.length).toBeGreaterThan(1);
        expect(() => instance.endLayer()).toThrowError();
    });

    test("Should error if there are no layers to end", () => {
        instance.endLayer();
        expect(() => instance.endLayer()).toThrowError();
    });

    test("Should remove the layer at the end of the buildStack", () => {
        instance.beginLayer('fooofofofof');

        const nLayersOnStackAtStart = instance.getBuildStack().length;
        instance.endLayer();
        const nLayersOnStackAfterEnd = instance.getBuildStack().length;

        expect(nLayersOnStackAfterEnd).toBe(nLayersOnStackAtStart - 1);
    });

    test("Calls stateManager.endKey()", () => {
        instance.beginLayer('whateverkey');
        stateManager.endKey = jest.fn(stateManager.endKey);
        instance.endLayer();
        expect(stateManager.endKey).toHaveBeenCalled();
    });
});

describe('beginElement()', () => {
    let prevUiElement: UiElement;

    beforeEach(() => {
        prevUiElement = instance.getCurElement();
    });

    test("Should error if buildStack is empty", () => {
        instance.getBuildStack().pop();
        expect(() => instance.beginElement('akey')).toThrowError();
    });

    test("Should push a new element into previous element's children", () => {
        const nPrevChildren = prevUiElement.children.length;
        instance.beginElement('testkey');
        expect(prevUiElement.children.length).toBe(nPrevChildren + 1);
    });

    test("Should change current element", () => {
        instance.beginElement('testkey');
        expect(instance.getCurElement()).not.toBe(prevUiElement);
    });

    test("Should push new element onto current layer's buildStack", () => {
        instance.beginElement('testkey');
        const buildStack = instance.getCurLayer().buildStack;
        expect(buildStack[buildStack.length - 1]).not.toBe(prevUiElement);
    });

    test("Should pass key into stateManager.beginKey()", () => {
        const key = 'key';
        stateManager.beginKey = jest.fn(stateManager.beginKey);
        instance.beginElement(key);
        expect(stateManager.beginKey).toHaveBeenCalledWith(key);
    });

    describe('postconditions', () => {
        beforeEach(() => instance.beginElement('somekey'));

        test("curUiElement should be on end of current layer's buildStack", () => {
            const layer = instance.getCurLayer().buildStack;
            expect(layer[layer.length - 1]).toBe(instance.getCurElement());
        });

        test('curUiElement should be the same as last child of prev element', () => {
            expect(instance.getCurElement())
                .toBe(prevUiElement.children[prevUiElement.children.length - 1]);
        });

        test("Last child of prev element should be on end of current layer's buildStack", () => {
            const layer = instance.getCurLayer().buildStack;
            expect(layer[layer.length - 1])
                .toBe(prevUiElement.children[prevUiElement.children.length - 1]);
        });
    });

    describe('onBeginChild hook', () => {
        beforeEach(() => prevUiElement.onBeginChild = jest.fn());

        test("Should call previous element's onBeginChild hook", () => {
            instance.beginElement('somekey');
            expect(prevUiElement.onBeginChild).toHaveBeenCalled();
        });

        test("Should pass self and child into previous element's onBeginChild hook", () => {
            instance.beginElement('somekey');
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
            instance.beginElement('somekey');
            child = instance.getCurElement();
        });

        test('Should error if buildStack empty', () => {
            instance.getBuildStack().pop();
            expect(() => instance.endElement()).toThrowError();
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

        test('Calls stateManager.endKey()', () => {
            instance.beginElement('justakey');
            stateManager.endKey = jest.fn(stateManager.endKey);
            instance.endElement();
            expect(stateManager.endKey).toHaveBeenCalled();
        });

        describe('postconditions', () => {
            beforeEach(() => instance.endElement());

            test("Should set curUiElement to previous parent", () => {
                expect(instance.getCurElement()).toBe(parent);
            });

            test("Should set top of current layer's buildStack to parent", () => {
                const layer = instance.getCurLayer().buildStack;
                expect(layer[layer.length - 1]).toBe(parent);
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

describe('floatElement()', () => {
    test("Adds current element to current layer's floats array", () => {
        instance.beginElement('somekey');
        instance.floatElement();

        const element = instance.getCurElement();
        const floats = instance.getCurLayer().floats;

        expect(floats.includes(element)).toBe(true);
    });
});

describe('render()', () => {

    let canvasContext: CanvasRenderingContext2D;
    beforeEach(() => { canvasContext = createFakeCanvasCtx() });

    test('should call renderElement on each element', () => {
        instance.onRenderElement = jest.fn();

        instance.beginElement('somekey');
        instance.endElement();
        instance.beginElement('somekey');
        {
            instance.beginElement('somekey');
            instance.endElement();
        }
        instance.endElement();

        instance.render(canvasContext);

        expect(instance.onRenderElement).toHaveBeenCalledTimes(4);
    });

    test('Should render layers in order of zIndex, then order of appearance', () => {
        const l1 = instance.getCurElement();

        instance.beginLayer('somekey');
        const l2 = instance.getCurElement();
        instance.endLayer();

        instance.beginLayer('somekey');
        const l3 = instance.getCurElement();
        instance.getCurElement().zIndex = 3;
        instance.endLayer();

        instance.beginLayer('somekey');
        const l4 = instance.getCurElement();
        instance.getCurElement().zIndex = 4;
        instance.endLayer();

        instance.beginLayer('somekey');
        const l5 = instance.getCurElement();
        instance.endLayer();


        const renderOrder: UiElement[] = [];
        const canvasContext = createFakeCanvasCtx();
        instance.onRenderElement = (e) => renderOrder.push(e);
        instance.render(canvasContext);

        expect(renderOrder.length).toBe(5);
        expect(renderOrder[0]).toBe(l1);
        expect(renderOrder[1]).toBe(l2);
        expect(renderOrder[2]).toBe(l5);
        expect(renderOrder[3]).toBe(l3);
        expect(renderOrder[4]).toBe(l4);
    });

    test('For each layer, should render floats at end', () => {
        const l0 = instance.getCurElement();

        instance.beginLayer('somekey');
        const l1 = instance.getCurElement();
        const l1e1 = normalWidget();
        const l1e2 = floatingWidget();
        const l1e3 = floatingWidget();
        const l1e4 = normalWidget();
        instance.endLayer();

        instance.beginLayer('somekey');
        const l2 = instance.getCurElement();
        const l2e1 = floatingWidget();
        const l2e2 = normalWidget();
        const l2e3 = floatingWidget();
        instance.endLayer();

        const expectedElements = [
            l0,
            l1,
            l1e1,
            l1e4,
            l1e2,
            l1e3,
            l2,
            l2e2,
            l2e1,
            l2e3,
        ];

        const renderedElements: UiElement[] = [];
        instance.onRenderElement = (e) => renderedElements.push(e);
        instance.render(canvasContext);

        expect(renderedElements.length).toBe(expectedElements.length);

        for (let i = 0; i < expectedElements.length; i++) {
            expect(renderedElements[i]).toBe(expectedElements[i]);
        }
    });
});

describe('dfsNonFloatSubraph()', () => {
    test('Uses DFS', () => {
        const root = instance.getCurElement();
        const A = normalWidget();
        const B = containerWidget(() => {
            normalWidget();
            normalWidget();
            normalWidget();
        });
        const [ BA, BB, BC ] = B.children;
        const C = containerWidget(() => {
            containerWidget(() => {
                normalWidget();
            });
        });
        const [ CA ] = C.children;
        const [ CAA ] = CA.children;

        const expectedElements = [
            root,
            A,
            B,
            BA,
            BB,
            BC,
            C,
            CA,
            CAA,
        ];

        const visitedElements: UiElement[] = [];
        instance.doDfsNonFloatSubraph(
            root,
            (e) => visitedElements.push(e),
        );

        expect(visitedElements.length).toBe(expectedElements.length);

        for (let i = 0; i < expectedElements.length; i++) {
            expect(visitedElements[i]).toBe(expectedElements[i]);
        }
    });
    
    test('Does not run for floating elements', () => {
        const root = instance.getCurElement();
        const A = normalWidget();
        const B = containerWidget(() => {
            normalWidget();
            floatingWidget();
            normalWidget();
        });
        const [ BA, BB, BC ] = B.children;

        const expectedElements = [
            root,
            A,
            B,
            BA,
            BC,
        ];

        const visitedElements: UiElement[] = [];
        instance.doDfsNonFloatSubraph(
            root,
            (e) => visitedElements.push(e),
        );

        expect(visitedElements.length).toBe(expectedElements.length);

        for (let i = 0; i < expectedElements.length; i++) {
            expect(visitedElements[i]).toBe(expectedElements[i]);
        }
    });
});

function normalWidget() {
    instance.beginElement('somekey');
    const element = instance.getCurElement();
    instance.endElement();
    return element;
}

function floatingWidget() {
    instance.beginElement('somekey');
    instance.floatElement();
    const element = instance.getCurElement();
    element.zIndex++;
    instance.endElement();
    return element;
}

function containerWidget(childBuilder: () => void) {
    instance.beginElement('somekey');
    const element = instance.getCurElement();
    childBuilder();
    instance.endElement();
    return element;
}

class InspectableContext extends ContextImpl {
    public onRenderElement: (element: UiElement) => void;

    renderElement(element: UiElement) {
        this.onRenderElement && this.onRenderElement(element);
        super.renderElement(element);
    }

    getUiElementPool() { return this.elementPool; }
    getLayers() { return this.layers; }
    getBuildStack() { return this.buildStack; }
    getCurLayer() { return this.curLayer; }
    getCurElement() { return this.curElement; }
    doDfsNonFloatSubraph(
        element: UiElement,
        onPreOrder: (element: UiElement) => void,
    ) {
        this.dfsNonFloatSubraph(element, onPreOrder);
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
        get: (_: {}, prop: string) => {
            onGet(prop);
            return onCall.bind(undefined, prop);
        },
        set: (_: {}, prop: string, value: any) => {
            onSet(prop, value);
            return true;
        },
    }) as CanvasRenderingContext2D;
}
