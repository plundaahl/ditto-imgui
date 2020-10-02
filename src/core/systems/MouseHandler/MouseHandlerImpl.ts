import { UiElement } from '../../types';
import { MouseHandler } from './MouseHandler';
import { ReadonlyMouseWatcher, MouseAction } from './MouseWatcher';

export class MouseHandlerImpl implements MouseHandler {
    protected readonly buildStack: UiElement[] = [];
    protected readonly hoverCandidates: UiElement[] = [];
    protected readonly parentsOfCandidates: Set<UiElement> = new Set();
    protected hoveredElement?: string;
    protected readonly parentsOfHoveredElement: string[] = [];
    protected readonly floatParentsOfHoveredElement: string[] = [];

    constructor(
        private readonly mouseWatcher: ReadonlyMouseWatcher,
    ) {
        this.onBeginElement = this.onBeginElement.bind(this);
        this.onEndElement = this.onEndElement.bind(this);
        this.onLayersSorted = this.onLayersSorted.bind(this);
        this.hoversElement = this.hoversElement.bind(this);
        this.hoversChild = this.hoversChild.bind(this);
        this.hoversFloatingChild = this.hoversFloatingChild.bind(this);
        this.isElementUnderMouse = this.isElementUnderMouse.bind(this);
        this.markParentsAsInelligible = this.markParentsAsInelligible.bind(this);
    }

    get dragX(): number {
        return this.mouseWatcher.dragX;
    }

    get dragY(): number {
        return this.mouseWatcher.dragY;
    }

    onBeginElement(element: UiElement): void {
        this.buildStack.push(element);
    }

    onEndElement(): void {
        const element = this.buildStack.pop();
        if (
            element
            && this.isElementUnderMouse(element)
            && !this.parentsOfCandidates.has(element)
        ) {
            this.hoverCandidates.push(element);
            this.markParentsAsInelligible(element);
        }
    }

    onLayersSorted(): void {
        const { mouseWatcher } = this;
        if (this.buildStack.length > 0) {
            throw new Error('Build stack not finished');
        }

        if (mouseWatcher.action !== MouseAction.M1_DRAG) {
            mouseWatcher.action = MouseAction.NONE;

            let hoveredElem: UiElement = this.hoverCandidates[0];
            if (hoveredElem) {
                for (const candidate of this.hoverCandidates) {
                    if (candidate.layer.zIndex > hoveredElem.layer.zIndex) {
                        hoveredElem = candidate;
                    }
                }
            }

            this.hoveredElement = hoveredElem ? hoveredElem.key : undefined;
            const hoveredElemParent = hoveredElem ? hoveredElem.parent : undefined;

            this.floatParentsOfHoveredElement.length = 0;
            this.parentsOfHoveredElement.length = 0;
            for (let parent = hoveredElemParent; parent; parent = parent.parent) {
                if (Object.is(parent.layer, hoveredElem.layer)) {
                    this.parentsOfHoveredElement.push(parent.key);
                } else {
                    this.floatParentsOfHoveredElement.push(parent.key);
                }
            }
        } else {
            mouseWatcher.dragX = 0;
            mouseWatcher.dragY = 0;
        }

        this.hoverCandidates.length = 0;
        this.parentsOfCandidates.clear();
    }

    hoversElement(): boolean {
        const { buildStack } = this;
        return buildStack[buildStack.length - 1].key === this.hoveredElement;
    }

    hoversChild(): boolean {
        const { buildStack } = this;
        const curKey = buildStack[buildStack.length - 1].key;
        return this.parentsOfHoveredElement.includes(curKey);
    }

    hoversFloatingChild(): boolean {
        const { buildStack } = this;
        const curKey = buildStack[buildStack.length - 1].key;
        return this.floatParentsOfHoveredElement.includes(curKey);
    }

    isM1Down(): boolean {
        return this.mouseWatcher.m1Down;
    }

    isM2Down(): boolean {
        return this.mouseWatcher.m2Down;
    }

    isM1Clicked(): boolean {
        return this.mouseWatcher.action === MouseAction.M1_CLICK;
    }

    isM2Clicked(): boolean {
        return this.mouseWatcher.action === MouseAction.M2_CLICK;
    }

    isM1DoubleClicked(): boolean {
        return this.mouseWatcher.action === MouseAction.M1_DOUBLECLICK;
    }

    isM1Dragged(): boolean {
        return this.mouseWatcher.action === MouseAction.M1_DRAG;
    }

    private isElementUnderMouse(element: UiElement): boolean {
        const { mouseWatcher: { posX, posY, isOverCanvas } } = this;
        if (!isOverCanvas) {
            return false;
        }

        const { bounds: { x, y, w, h } } = element;
        return x <= posX && posX <= x + w && y <= posY && posY <= y + h;
    }

    private markParentsAsInelligible(element: UiElement) {
        const { parentsOfCandidates, buildStack } = this;

        for (let i = buildStack.length - 1; i >= 0; i--) {
            const parent = buildStack[i];
            if (!Object.is(parent.layer, element.layer)) {
                break;
            }

            parentsOfCandidates.add(parent);
        }
    }
}
