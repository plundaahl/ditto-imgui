import { RgbColor } from './RgbColor';

const hexRegex = /(^#[0-9a-fA-F]{3}$)|(^#[0-9a-fA-F]{6}$)/;
const HEX = 16;

export class HexColor {
    private readonly data: RgbColor;
    private _r: number;
    private _g: number;
    private _b: number;
    private hexString: string;

    constructor();
    constructor(hexcode: string);
    constructor(colorData: RgbColor);
    constructor(arg?: any) {
        if (arg instanceof RgbColor) {
            this.data = arg;
        } else {
            this.data = new RgbColor();
        }

        if (typeof arg === 'string') {
            this.fromString(arg);
        }
    }

    public fromString(text: string) {
        if (!hexRegex.test(text)) {
            throw new Error(`${text} (of type ${typeof text}) is not a valid hex code`);
        }

        const len = text.length === 4 ? 1 : 2;

        this.data.r = this.parseHex(text.substr(1, len));
        this.data.g = this.parseHex(text.substr(1 + len, len));
        this.data.b = this.parseHex(text.substr(1 + len + len, len));
    }

    private parseHex(text: string): number {
        if (text.length === 1) {
            return parseInt(`0x${text}${text}`);
        }
        return parseInt(`0x${text}`);
    }

    public toString(): string {
        if (this.isCacheValid()) {
            return this.hexString;
        }
        const { data } = this;

        let r = data.r.toString(HEX);
        let g = data.g.toString(HEX);
        let b = data.b.toString(HEX);

        r = data.r < HEX ? `0${r}` : r;
        g = data.g < HEX ? `0${g}` : g;
        b = data.b < HEX ? `0${b}` : b;

        this.updateCache();
        this.hexString = `#${r}${g}${b}`;
        return this.hexString;
    }

    private isCacheValid(): boolean {
        const { data } = this;
        return (
            this._r === data.r &&
            this._g === data.g &&
            this._b === data.b
        );
    }

    private updateCache() {
        const { data } = this;
        this._r = data.r;
        this._g = data.g;
        this._b = data.b;
    }
}
