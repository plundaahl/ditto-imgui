import { BoundingBox } from '../BoundingBox';


describe('basics', () => {
    const x = 5;
    const y = 7;
    const w = 3;
    const h = 6;

    let instance: BoundingBox;

    beforeEach(() => instance = new BoundingBox(x, y, w, h));

    test('set #left updates x to passed-in value', () => {
        instance.left = 2;
        expect(instance.x).toBe(2);
    });

    test('set #left does not modify result of #right', () => {
        const right = instance.right;
        instance.left = 2;
        expect(instance.right).toBe(right);
    });

    test('set #top updates y to passed-in value', () => {
        instance.top = 2;
        expect(instance.y).toBe(2);
    });

    test('set #left does not modify result of #right', () => {
        const bottom = instance.bottom;
        instance.top = 2;
        expect(instance.bottom).toBe(bottom);
    });

    test('set #right does not modify #left', () => {
        const left = instance.left;
        instance.right = 22;
        expect(instance.left).toBe(left);
    });

    test('set #bottom does not modify #top', () => {
        const top = instance.top;
        instance.bottom = 34;
        expect(instance.top).toBe(top);
    });

    test('reset sets all parameters to 0', () => {
        instance.reset();
        expect(instance.x).toBe(0);
        expect(instance.y).toBe(0);
        expect(instance.w).toBe(0);
        expect(instance.h).toBe(0);
        expect(instance.left).toBe(0);
        expect(instance.right).toBe(0);
        expect(instance.top).toBe(0);
        expect(instance.bottom).toBe(0);
    });

    test('fromBoundingBox copies other box', () => {
        const otherX = 22;
        const otherY = 4;
        const otherW = 6;
        const otherH = 3;
        instance.fromBoundingBox(new BoundingBox(
            otherX,
            otherY,
            otherW,
            otherH,
        ));
        expect(instance.x).toBe(otherX);
        expect(instance.y).toBe(otherY);
        expect(instance.w).toBe(otherW);
        expect(instance.h).toBe(otherH);
    });
});

