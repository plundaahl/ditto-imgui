import { BoundsService } from '../BoundsService';
import { BoundsServiceImpl } from '../BoundsServiceImpl';
import { UiElement, Box } from '../../../types';
import { createDummyElement } from '../../../test/helpers';

let instance: BoundsService;

beforeEach(() => {
    instance = new BoundsServiceImpl();
});

describe('getChildBounds', () => {
    describe('Given there is no element', () => {
        test('should error', () => {
            expect(instance.getChildBounds).toThrow();
        });
    });

    describe('given that there is an element, and no children have been added', () => {
        let element: UiElement;
        
        beforeEach(() => {
            element = createDummyElement({
                bounds: { x: 100, y: 100, w: 300, h: 200 },
            });
            instance.onBeginElement(element);
        });

        test('should not error', () => {
            expect(instance.getChildBounds).not.toThrow();
        });

        describe('returned bounding box', () => {
            let usedBounds: Readonly<Box>;

            beforeEach(() => {
                usedBounds = instance.getChildBounds();
            });

            test('returned box should have x set to element x', () => {
                expect(usedBounds.x).toBe(element.bounds.x);
            });

            test('returned boy should have y set to element y', () => {
                expect(usedBounds.y).toBe(element.bounds.y);
            });

            test('returned box should have 0 height', () => {
                expect(usedBounds.h).toBe(0);
            });

            test('returned box should have 0 width', () => {
                expect(usedBounds.w).toBe(0);
            });
        });
    });

    describe('given that there is an element, and children have been added', () => {
        let element: UiElement;
        let children: UiElement[];
        let childBounds: Readonly<Box>;

        beforeEach(() => {
            element = createDummyElement({
                bounds: { x: 50, y: 100, w: 350, h: 500 },
            });

            children = [
                createDummyElement({ bounds: { x: 100, y: 100, w: 300, h: 50 } }),
                createDummyElement({ bounds: { x: 100, y: 150, w: 150, h: 50 } }),
                createDummyElement({ bounds: { x: 250, y: 150, w: 150, h: 50 } }),
                createDummyElement({ bounds: { x: 100, y: 200, w: 200, h: 80 } }),
            ];

            instance.onBeginElement(element);

            for (const child of children) {
                element.children.push(child);
                child.parent = element;
                instance.onBeginElement(child);
                instance.onEndElement();
            }

            childBounds = instance.getChildBounds();
        });

        test('childBounds X should be left-most child X', () => {
            const expectedX = children
                .map(child => child.bounds.x)
                .reduce(
                    (prev, cur) => Math.min(prev, cur),
                    children[0].bounds.x,
                );

            expect(childBounds.x).toBe(expectedX);
        });

        test('childBounds Y should be top-most child Y', () => {
            const expectedY = children
                .map(child => child.bounds.x)
                .reduce(
                    (prev, cur) => Math.min(prev, cur),
                    children[0].bounds.y,
                );

            expect(childBounds.y).toBe(expectedY);
        });

        test('childBounds W should be correct', () => {
            const expectedLeft = children
                .map(child => child.bounds.x)
                .reduce(
                    (prev, cur) => Math.min(prev, cur),
                    children[0].bounds.x,
                );

            const expectedRight = children
                .map(child => child.bounds.x + child.bounds.w)
                .reduce(
                    (prev, cur) => Math.max(prev, cur),
                    children[0].bounds.x + children[0].bounds.w,
                );

            expect(childBounds.w).toBe(expectedRight - expectedLeft);
        });

        test('childBounds H should be correct', () => {
            const expectedTop = children
                .map(child => child.bounds.y)
                .reduce(
                    (prev, cur) => Math.min(prev, cur),
                    children[0].bounds.y,
                );

            const expectedBottom = children
                .map(child => child.bounds.y + child.bounds.h)
                .reduce(
                    (prev, cur) => Math.max(prev, cur),
                    children[0].bounds.y + children[0].bounds.h,
                );

            expect(childBounds.h).toBe(expectedBottom - expectedTop);
        });
    });
});

