import { clamp } from './util';

const MIN = 0;
const MAX = 255;

export class ColorCore {
    private _r: number = 0;
    private _b: number = 0;
    private _g: number = 0;

    set r(value: number) { this._r = Math.floor(clamp(MIN, value, MAX)); }
    get r(): number { return this._r; }

    set g(value: number) { this._g = Math.floor(clamp(MIN, value, MAX)); }
    get g(): number { return this._g; }

    set b(value: number) { this._b = Math.floor(clamp(MIN, value, MAX)); }
    get b(): number { return this._b; }
}
