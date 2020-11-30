import { ColorCore } from './ColorCore';

const hexRegex = /(^#[0-9a-fA-F]{3}$)|(^#[0-9a-fA-F]{6}$)/;
const HEX = 16;

export class HexColor {
    private readonly data: ColorCore;

    constructor();
    constructor(hexcode: string);
    constructor(colorData: ColorCore);
    constructor(arg?: any) {
        if (arg instanceof ColorCore) {
            this.data = arg;
        } else {
            this.data = new ColorCore();
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
        const { data } = this;

        let r = data.r.toString(HEX);
        let g = data.g.toString(HEX);
        let b = data.b.toString(HEX);

        r = data.r < HEX ? `0${r}` : r;
        g = data.g < HEX ? `0${g}` : g;
        b = data.b < HEX ? `0${b}` : b;

        return `#${r}${g}${b}`;
    }
}
