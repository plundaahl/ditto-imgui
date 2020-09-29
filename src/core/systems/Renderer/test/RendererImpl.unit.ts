import { UiElement, Layer } from '../../../types';
import { RendererImpl } from '../RendererImpl';
import { createFakeCanvasContext } from '../../../test/createFakeCanvasContext';

class InspectableRendererImpl extends RendererImpl {
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

let instance: InspectableRendererImpl;
let context: CanvasRenderingContext2D;

beforeEach(() => {
    context = createFakeCanvasContext();
    instance = new InspectableRendererImpl(context);
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
