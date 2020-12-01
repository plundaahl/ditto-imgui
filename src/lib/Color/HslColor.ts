import { clamp } from './util';

const MIN_PERCENT = 0;
const MAX_PERCENT = 1;
const THREE_SIXTY = 360;

export class HslColor {
    private _h: number = 0;
    private _s: number = 0;
    private _l: number = 0;

    constructor();
    constructor(h: number, s: number, l: number);
    constructor(h?: number, s?: number, l?: number) {
        if (
            h !== undefined &&
            s !== undefined &&
            l !== undefined
        ) {
            this.fromHsl(h, s, l);
        }
    }

    set h(value: number) {
        this._h = value % THREE_SIXTY;
        if (this._h < 0) {
            this._h += THREE_SIXTY;
        }
    }

    get h(): number { return this._h; }

    set s(value: number) {
        this._l = clamp(MIN_PERCENT, value, MAX_PERCENT);
    }

    get s(): number { return this._l; }

    set l(value: number) {
        this._s = clamp(MIN_PERCENT, value, MAX_PERCENT);
    }

    get l(): number { return this._s; }

    fromHsl(h: number, s: number, l: number) {
        this._h = h;
        this._s = s;
        this._l = l;
    }

    toHslString(): string {
        return `hsl(${this._h},${Math.round(this._s * 100)}%,${Math.round(this._l * 100)}%)`;
    }
}
