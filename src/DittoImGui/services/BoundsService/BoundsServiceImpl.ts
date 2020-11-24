import { BoundsService } from './BoundsService';
import { UiElement, Box } from '../../types';

export class BoundsServiceImpl implements BoundsService {
    private elementStack: UiElement[] = [];
    private usedBoundsStack: Box[] = [];

    constructor() {
        this.onBeginElement = this.onBeginElement.bind(this);
        this.onEndElement = this.onEndElement.bind(this);
        this.getElementBounds = this.getElementBounds.bind(this);
        this.getChildBounds = this.getChildBounds.bind(this);
    }

    onBeginElement(element: UiElement): void {
        this.elementStack.push(element);
        this.usedBoundsStack.push(this.createBoundingBox());
    }

    onEndElement(): void {
        const box = this.usedBoundsStack.pop();
        if (box) {
            this.releaseBoundingBox(box);
        }

        const element = this.elementStack.pop();
        if (!element) {
            throw new Error('Called onEndElement when no element was on stack');
        }

        const curChildBounds = this.getCurElementChildBounds();
        const parent = this.getCurElement();
        if (!curChildBounds || !parent) {
            return;
        }

        const lastElemBounds = element.bounds;

        if (parent.children.length === 1) {
            curChildBounds.x = lastElemBounds.x;
            curChildBounds.y = lastElemBounds.y;
            curChildBounds.h = lastElemBounds.h;
            curChildBounds.w = lastElemBounds.w;
        } else if (parent.children.length > 1) {
            const left = Math.min(
                curChildBounds.x,
                lastElemBounds.x,
            );

            const top = Math.min(
                curChildBounds.y,
                lastElemBounds.y,
            );

            const right = Math.max(
                curChildBounds.x + curChildBounds.w,
                lastElemBounds.x + lastElemBounds.w,
            );

            const bottom = Math.max(
                curChildBounds.y + curChildBounds.h,
                lastElemBounds.y + lastElemBounds.h,
            );

            curChildBounds.x = left;
            curChildBounds.y = top;
            curChildBounds.w = right - left;
            curChildBounds.h = bottom - top;
        }
    }

    getElementBounds(): Box {
        const element = this.getCurElement();
        if (!element) {
            throw new Error('No element is active');
        }
        return element.bounds;
    }

    getChildBounds(): Readonly<Box> {
        const element = this.getCurElement();
        const bounds = this.getCurElementChildBounds();
        if (!element || !bounds) {
            throw new Error('No element is active');
        }

        if (element.children.length === 0) {
            bounds.x = element.bounds.x;
            bounds.y = element.bounds.y;
        }

        return bounds;
    }

    private getCurElement(): UiElement | undefined {
        const { elementStack } = this;
        return elementStack[elementStack.length - 1];
    }

    private getCurElementChildBounds(): Box | undefined {
        const { usedBoundsStack } = this;
        return usedBoundsStack[usedBoundsStack.length - 1];
    }

    private createBoundingBox(): Box {
        return {
            x: 0,
            y: 0,
            w: 0,
            h: 0,
        };
    }

    private releaseBoundingBox(box: Box): void {
        // no-op
    }
}
