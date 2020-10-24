import { UiElement, Layer } from '../../../../types';
import { RenderServiceImpl } from '../RenderServiceImpl';
import { createFakeCanvasContext } from '../../../test/createFakeCanvasContext';

class InspectableRenderServiceImpl extends RenderServiceImpl {
    private _onRenderElement: (element: UiElement) => void;

    onRenderElement(fn: (element: UiElement) => void) {
        this._onRenderElement = fn;
    }

    renderElement(element: UiElement) {
        if (this._onRenderElement) {
            this._onRenderElement(element);
        }
        super.renderElement(element);
    }
}

let instance: InspectableRenderServiceImpl;
let context: CanvasRenderingContext2D;

beforeEach(() => {
    context = createFakeCanvasContext();
    instance = new InspectableRenderServiceImpl(context);
});

describe('renderElement', () => {
    let renderElementSpy = jest.fn();
    let element: UiElement;

    beforeEach(() => {
        element = createElement(
            createElement(),
            createElement(),
            createElement(),
            createElement(),
            createElement(),
        );

        element.children[1].layer = { key: 'anotherlayer', zIndex: 4 };
        element.children[3].layer = { key: 'differentlayer', zIndex: 7 };

        instance.onRenderElement(renderElementSpy);
        jest.clearAllMocks();

        instance.renderElement(element);
    });

    test('should not render any children on different layer', () => {
        expect(renderElementSpy).not.toHaveBeenCalledWith(element.children[1]);
        expect(renderElementSpy).not.toHaveBeenCalledWith(element.children[3]);
    });

    test('should render all children on same layer', () => {
        expect(renderElementSpy).toHaveBeenCalledWith(element.children[0]);
        expect(renderElementSpy).toHaveBeenCalledWith(element.children[2]);
        expect(renderElementSpy).toHaveBeenCalledWith(element.children[4]);
    });
});

describe('render', () => {
    test('should render layers in order', () => {
        const layers: Layer[] = [
            createLayer(createElement()),
            createLayer(createElement()),
            createLayer(createElement()),
        ];

        const elementsRendered: UiElement[] = [];
        instance.onRenderElement((e) => elementsRendered.push(e));

        instance.render(layers);

        expect(elementsRendered.length).toBe(3);
        expect(elementsRendered[0]).toBe(layers[0].rootElement);
        expect(elementsRendered[1]).toBe(layers[1].rootElement);
        expect(elementsRendered[2]).toBe(layers[2].rootElement);
    });

    test('should render elements in each layer depth-first pre-order', () => {
        const layer: Layer = createLayer(
            createElement(
                createElement(),
                createElement(
                    createElement(),
                    createElement(),
                ),
                createElement(),
            ),
        );

        const rootElement = layer.rootElement;
        if (!rootElement) {
            throw new Error('root element should not be undefined');
        }

        const elementsRendered: UiElement[] = [];
        instance.onRenderElement((e) => elementsRendered.push(e));

        const expectedOrder = [
            rootElement,
            rootElement.children[0],
            rootElement.children[1],
            rootElement.children[1].children[0],
            rootElement.children[1].children[1],
            rootElement.children[2],
        ];

        instance.render([ layer ]);

        expect(elementsRendered.length).toBe(expectedOrder.length);
        for (let i = 0; i < elementsRendered.length; i++) {
            expect(elementsRendered[i]).toBe(expectedOrder[i]);
        }
    });
});

function createElement(...children: UiElement[]): UiElement {
    const element: UiElement = {
        key: 'doesnotmatter',
        children,
        drawBuffer: [],
        layer: undefined as unknown as Layer,
        bounds: { x: 0, y: 0, w: 0, h: 0 },
    }

    for (const child of children) {
        child.parent = element;
    }

    return element;
}

function createLayer(child: UiElement): Layer {
    const layer: Layer = {
        key: 'doesnotmatter',
        zIndex: 0,
        rootElement: child,
    };

    const setLayerForElement = (element: UiElement) => {
        element.layer = layer;
        for (const child of element.children) {
            setLayerForElement(child);
        }
    }

    return layer;
}
