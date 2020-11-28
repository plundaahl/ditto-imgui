import { ColorCore } from './ColorCore';

export class RgbColor {
    private readonly data: ColorCore;

    constructor(r: number, g: number, b: number);
    constructor(colorData: ColorCore);
    constructor();
    constructor(rOrColorData?: any, g?: number, b?: number) {
        if (!rOrColorData) {
            this.data = new ColorCore();
        } else if (rOrColorData instanceof ColorCore) {
            this.data = rOrColorData;
        } else if (g !== undefined && b !== undefined) {
            this.data = new ColorCore();
            this.data.r = rOrColorData;
            this.data.g = g;
            this.data.b = b;
        }
    }

    get r(): number { return this.data.r; }
    set r(val: number) { this.data.r = val; }
    get g(): number { return this.data.g; }
    set g(val: number) { this.data.g = val; }
    get b(): number { return this.data.b; }
    set b(val: number) { this.data.b = val; }

    toString(): string {
        const { data } = this;
        return `rgb(${data.r},${data.g},${data.b})`;
    }
}

