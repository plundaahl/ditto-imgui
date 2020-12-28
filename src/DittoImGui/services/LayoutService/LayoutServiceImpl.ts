import { UiElement } from '../../types';
import { LayoutFunction, LayoutService } from './LayoutService';

export class LayoutServiceImpl implements LayoutService {

    private readonly elementStack: UiElement[] = [];
    private readonly globalConstraints: LayoutFunction[] = [];
    private readonly childConstraints: LayoutFunction[][] = [];
    private readonly elementConstraints: LayoutFunction[][] = [];

    constructor() {
        this.onBeginElement = this.onBeginElement.bind(this);
        this.onEndElement = this.onEndElement.bind(this);
        this.onPostRender = this.onPostRender.bind(this);
        this.addConstraints = this.addConstraints.bind(this);
        this.addChildConstraints = this.addChildConstraints.bind(this);
        this.addGlobalConstraints = this.addGlobalConstraints.bind(this);
        this.calculateLayout = this.calculateLayout.bind(this);
    }

    addConstraints(...constraints: LayoutFunction[]): void {
        this.currentElementConstraints.push(...constraints);
    }

    addChildConstraints(...constraints: LayoutFunction[]): void {
        this.childConstraints[this.childConstraints.length - 1].push(...constraints);
    }

    addGlobalConstraints(...constraints: LayoutFunction[]): void {
        this.globalConstraints.push(...constraints);
    }

    calculateLayout(): void {
        for (const constraint of this.currentElementConstraints) {
            constraint();
        }
    }

    onBeginElement(element: UiElement): void {
        const parent = this.currentElement;
        this.elementStack.push(element);

        this.elementConstraints.push([...this.globalConstraints]);
        if (parent && parent.layer === element.layer) {
            this.currentElementConstraints.push(...this.currentChildConstraints);
        }

        this.childConstraints.push([]);
    }

    onEndElement(): void {
        this.elementStack.pop();
        this.childConstraints.pop();
        this.elementConstraints.pop();
    }

    onPostRender(): void {
        if (this.elementStack.length) {
            throw new Error('Called onPostRender while one or more elements were active');
        }
        this.globalConstraints.length = 0;
    }

    private get currentElementConstraints() {
        const { elementConstraints } = this;
        if (!elementConstraints.length) {
            throw new Error('No element active');
        }
        return elementConstraints[elementConstraints.length - 1];
    }

    private get currentChildConstraints() {
        const { childConstraints } = this;
        return childConstraints[childConstraints.length - 1] || [];
    }

    private get currentElement(): UiElement | undefined {
        const { elementStack } = this;
        return elementStack[elementStack.length - 1];
    }
}

