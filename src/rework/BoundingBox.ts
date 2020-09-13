export class BoundingBox {
    x: number;
    y: number;
    w: number;
    h: number;

    constructor(x = 0, y = 0, w = 0, h = 0) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    reset() {
        this.x = 0;
        this.y = 0;
        this.w = 0;
        this.h = 0;
    }

    fromBoundingBox(box: BoundingBox) {
        this.x = box.x;
        this.y = box.y;
        this.w = box.w;
        this.h = box.h;
    }

    get left() {
        return this.x;
    }

    set left(value: number) {
        const delta = value - this.x;
        this.x += delta;
        this.w -= delta;
    }

    get right() {
        return this.x + this.w;
    }

    set right(value: number) {
        this.w += value - this.x - this.w;
    }

    get top() {
        return this.y;
    }

    set top(value: number) {
        const delta = value - this.y;
        this.y += delta;
        this.h -= delta;
    }

    get bottom() {
        return this.y + this.h;
    }

    set bottom(value: number) {
        this.h += value - this.y - this.h;
    }
}
