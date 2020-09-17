import { ContextImpl } from '../Context';
import { UiElement } from '../UiElement';

class InspectableContext extends ContextImpl {
    public onRenderElement: (element: UiElement) => void;

    constructor() {
        super(createFakeCanvasCtx);
    }

    renderElement(element: UiElement) {
        this.onRenderElement && this.onRenderElement(element);
        super.renderElement(element);
    }

    getUiElementPool() { return this.elementPool; }
    getLayers() { return this.layers; }
    getBuildStack() { return this.buildStack; }
    getCurLayerStack() { return this.curLayerStack; }
    getCurElement() { return this.curElement; }
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

let instance: InspectableContext;
beforeEach(() => { instance = new InspectableContext(); });

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

    test('sets current layer stack length to 1', () => {
        expect(instance.getCurLayerStack().length).toBe(1);
    });

    test('sets cur element to root of current layerStack', () => {
        expect(instance.getCurElement()).toBe(instance.getCurLayerStack()[0]);
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

describe('get curLayerStack', () => {
    test('Should return last element in buildStack', () => {
        const pool = instance.getUiElementPool();
        const buildStack = instance.getBuildStack();

        expect(instance.getCurLayerStack()).toBe(buildStack[buildStack.length - 1]);

        let layer = [ pool.provision() ];
        buildStack.push(layer);
        expect(instance.getCurLayerStack()).toBe(layer);

        layer = [ pool.provision() ];
        buildStack.push(layer);
        expect(instance.getCurLayerStack()).toBe(layer);
    });

    test('Should error if buildStack empty', () => {
        instance.getBuildStack().pop();
        expect(() => instance.getCurLayerStack()).toThrowError();
    });

    test('Should error if current layerStack empty', () => {
        instance.getBuildStack().pop();
        expect(() => instance.getCurLayerStack()).toThrowError();
    });
});

describe('beginLayer()', () => {
    test('Should increment buildStack', () => {
        const buildStackLength = instance.getBuildStack().length;
        instance.beginLayer();
        expect(instance.getBuildStack().length).toBe(buildStackLength + 1);
    });

    test('New curLayerStack should have 1 element', () => {
        instance.beginLayer();
        expect(instance.getCurLayerStack().length).toBe(1);
    });

    test("Should add new layer to layers array", () => {
        const nLayersAtStart = instance.getLayers().length;
        instance.beginLayer();
        const nLayersAfterCall = instance.getLayers().length;
        expect(nLayersAfterCall).toBe(nLayersAtStart + 1);
    });
});

describe('endLayer()', () => {
    test("Should error if current layer stack has more than 1 element", () => {
        instance.beginLayer();
        instance.beginElement();

        expect(instance.getCurLayerStack().length).toBeGreaterThan(1);
        expect(() => instance.endLayer()).toThrowError();
    });

    test("Should error if there are no layers to end", () => {
        instance.endLayer();
        expect(() => instance.endLayer()).toThrowError();
    });

    test("Should remove the layer at the end of the buildStack", () => {
        instance.beginLayer();

        const nLayersOnStackAtStart = instance.getBuildStack().length;
        instance.endLayer();
        const nLayersOnStackAfterEnd = instance.getBuildStack().length;

        expect(nLayersOnStackAfterEnd).toBe(nLayersOnStackAtStart - 1);
    });
});

describe('beginElement()', () => {
    let prevUiElement: UiElement;

    beforeEach(() => {
        prevUiElement = instance.getCurElement();
    });

    test("Should error if buildStack is empty", () => {
        instance.getBuildStack().pop();
        expect(() => instance.beginElement()).toThrowError();
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

    test("Should push new element onto current layer stack", () => {
        instance.beginElement();
        const navStack = instance.getCurLayerStack();
        expect(navStack[navStack.length - 1]).not.toBe(prevUiElement);
    });

    describe('postconditions', () => {
        beforeEach(() => instance.beginElement());

        test('curUiElement should be on end of current layer stack', () => {
            const layerStack = instance.getCurLayerStack();
            expect(layerStack[layerStack.length - 1]).toBe(instance.getCurElement());
        });

        test('curUiElement should be the same as last child of prev element', () => {
            expect(instance.getCurElement())
                .toBe(prevUiElement.children[prevUiElement.children.length - 1]);
        });

        test('Last child of prev element should be on end of current layer stack', () => {
            const layerStack = instance.getCurLayerStack();
            expect(layerStack[layerStack.length - 1])
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

        describe('postconditions', () => {
            beforeEach(() => instance.endElement());

            test("Should set curUiElement to previous parent", () => {
                expect(instance.getCurElement()).toBe(parent);
            });

            test("Should set top of current layer stack to parent", () => {
                const layerStack = instance.getCurLayerStack();
                expect(layerStack[layerStack.length - 1]).toBe(parent);
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

describe('render()', () => {

    let canvasContext: CanvasRenderingContext2D;
    beforeEach(() => { canvasContext = createFakeCanvasCtx() });

    test('should call renderElement on each element', () => {
        instance.onRenderElement = jest.fn();

        instance.beginElement();
        instance.endElement();
        instance.beginElement();
        {
            instance.beginElement();
            instance.endElement();
        }
        instance.endElement();

        instance.render(canvasContext);

        expect(instance.onRenderElement).toHaveBeenCalledTimes(4);
    });

    test('Should render layers in order of zIndex, then order of appearance', () => {
        const l1 = instance.getCurElement();

        instance.beginLayer();
        const l2 = instance.getCurElement();
        instance.endLayer();

        instance.beginLayer();
        const l3 = instance.getCurElement();
        instance.getCurElement().zIndex = 3;
        instance.endLayer();

        instance.beginLayer();
        const l4 = instance.getCurElement();
        instance.getCurElement().zIndex = 4;
        instance.endLayer();

        instance.beginLayer();
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
});

