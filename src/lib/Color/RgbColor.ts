import { HslColor } from './HslColor';
import { clamp } from './util';

const TWO_FIFTY_FIVE = 255;
const ZERO = 0;
const SIXTY = 60;
const ONE_OVER_SIXTY = 1 / 60;

export class RgbColor {
    private readonly data: HslColor;
    private _r: number = 0;
    private _g: number = 0;
    private _b: number = 0;
    private _h: number;
    private _s: number;
    private _l: number;

    constructor(r: number, g: number, b: number);
    constructor(colorData: HslColor);
    constructor();
    constructor(rOrColorData?: any, g?: number, b?: number) {
        if (rOrColorData instanceof HslColor) {
            this.data = rOrColorData;
        } else {
            this.data = new HslColor();

            if (
                typeof rOrColorData === 'number' &&
                g !== undefined &&
                b !== undefined
            ) {
                this.toHsl(rOrColorData, g, b);
            }
        }
    }

    get r(): number {
        this.calcRgbFromHsl();
        return this._r;
    }

    set r(val: number) {
        this.toHsl(val, this.g, this.b);
    }

    get g(): number {
        this.calcRgbFromHsl();
        return this._g;
    }

    set g(val: number) {
        this.toHsl(this.r, val, this.b);
    }

    get b(): number {
        this.calcRgbFromHsl();
        return this._b;
    }

    set b(val: number) {
        this.toHsl(this.r, this.g, val);
    }

    toString(): string {
        this.calcRgbFromHsl();
        return `rgb(${this._r},${this._g},${this._b})`;
    }

    private toHsl(r: number, g: number, b: number) {
        // see https://www.rapidtables.com/convert/color/rgb-to-hsl.html
        const { data } = this;

        const rPrime = clamp(ZERO, r, TWO_FIFTY_FIVE)/TWO_FIFTY_FIVE;
        const gPrime = clamp(ZERO, g, TWO_FIFTY_FIVE)/TWO_FIFTY_FIVE;
        const bPrime = clamp(ZERO, b, TWO_FIFTY_FIVE)/TWO_FIFTY_FIVE;

        const cMax = Math.max(rPrime, gPrime, bPrime);
        const cMin = Math.min(rPrime, gPrime, bPrime);
        
        const delta = cMax - cMin;

        // hue
        if (delta === 0) {
            data.h = 0;
        } else if (cMax === rPrime) {
            data.h = SIXTY * (((gPrime - bPrime) / delta) % 6);
        } else if (cMax === gPrime) {
            data.h = SIXTY * (((bPrime - rPrime) / delta) + 2);
        } else {
            data.h = SIXTY * (((rPrime - gPrime) / delta) + 4);
        }

        // lightness
        data.l = (cMax + cMin) / 2;

        // saturation
        if (delta === 0) {
            data.s = 0;
        } else {
            data.s = delta / (1 - Math.abs(cMax + cMin - 1))
        }
    }

    private calcRgbFromHsl() {
        if (this.isCacheValid()) {
            return;
        }
        this.updateCache();

        // see https://www.rapidtables.com/convert/color/hsl-to-rgb.html
        const { data: { h, s, l } } = this;
        const c = (1 - Math.abs((2 * l) - 1)) * s;
        const x = c * (1 - Math.abs(((h * ONE_OVER_SIXTY) % 2) - 1));
        const m = l - (c * 0.5);

        let rPrime: number;
        let gPrime: number;
        let bPrime: number;

        switch (Math.floor(h * ONE_OVER_SIXTY)) {
            case 0: rPrime = c; gPrime = x; bPrime = 0; break;
            case 1: rPrime = x; gPrime = c; bPrime = 0; break;
            case 2: rPrime = 0; gPrime = c; bPrime = x; break;
            case 3: rPrime = 0; gPrime = x; bPrime = c; break;
            case 4: rPrime = x; gPrime = 0; bPrime = c; break;
            case 5: rPrime = c; gPrime = 0; bPrime = x; break;
            default: throw new Error(`HslColor had invalid h value ${h}`);
        }

        this._r = Math.round((rPrime + m) * TWO_FIFTY_FIVE);
        this._g = Math.round((gPrime + m) * TWO_FIFTY_FIVE);
        this._b = Math.round((bPrime + m) * TWO_FIFTY_FIVE);
    }

    private isCacheValid(): boolean {
        const { data } = this;
        return (
            this._h === data.h &&
            this._s === data.s &&
            this._l === data.l
        );
    }

    private updateCache() {
        const { data } = this;
        this._h === data.h;
        this._s === data.s;
        this._l === data.l;
    }
}

