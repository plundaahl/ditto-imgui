import { UiElement } from '../../types';
import { LayoutFunction, LayoutService } from './LayoutService';

export class LayoutServiceImpl implements LayoutService {

    private readonly elementStack: UiElement[] = [];
    private readonly layoutFunctionMap: Map<UiElement, LayoutFunction> = new Map();

    constructor(
        private readonly defaultLayoutFn: LayoutFunction,
    ) {
        this.setLayout = this.setLayout.bind(this);
        this.onBeginElement = this.onBeginElement.bind(this);
        this.onEndElement = this.onEndElement.bind(this);
        this.onPostRender = this.onPostRender.bind(this);
    }

    setLayout(layoutFunction: LayoutFunction): void {
        const { elementStack, layoutFunctionMap } = this;
        const curElement = elementStack[elementStack.length - 1];

        if (layoutFunctionMap.has(curElement)) {
            throw new Error(
                `Layout already set for element with key ${curElement.key}. Do not try to set the layout for the same element more than once in a single render pass.`
            );
        }

        layoutFunctionMap.set(curElement, layoutFunction);
    }

    onBeginElement(element: UiElement): void {
        const { elementStack, layoutFunctionMap } = this;
        const parent = elementStack[elementStack.length - 1];
        this.elementStack.push(element);

        if (!parent) {
            return;
        }

        if (parent.layer !== element.layer) {
            return;
        }

        const layoutFn = layoutFunctionMap.get(parent) || this.defaultLayoutFn;
        layoutFn();
    }

    onEndElement(): void {
        this.elementStack.pop();
    }

    onPostRender(): void {
        if (this.elementStack.length !== 0) {
            throw new Error('onPostRender called, but not all elements are finished');
        }
        this.layoutFunctionMap.clear();
    }
}

