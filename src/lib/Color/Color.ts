import { HslColor } from './HslColor';
import { HexColor } from './HexColor';
import { RgbColor } from './RgbColor';

export class Color {
    private readonly hsl: HslColor;
    private readonly rgb: RgbColor;
    private readonly hex: HexColor;

    constructor() {
        this.hsl = new HslColor();
        this.rgb = new RgbColor(this.hsl);
        this.hex = new HexColor(this.rgb);
    }

    get r(): number { return this.rgb.r; }
    set r(v: number) { this.rgb.r = v; }
    get g(): number { return this.rgb.g; }
    set g(v: number) { this.rgb.g = v; }
    get b(): number { return this.rgb.b; }
    set b(v: number) { this.rgb.b = v; }

    get h(): number { return this.hsl.h; }
    set h(v: number) { this.hsl.h = v; }
    get s(): number { return this.hsl.s; }
    set s(v: number) { this.hsl.s = v; }
    get l(): number { return this.hsl.l; }
    set l(v: number) { this.hsl.l = v; }

    static fromRgb(r: number, g: number, b: number): Color {
        const color = new Color();
        color.r = r;
        color.g = g;
        color.b = b;
        return color;
    }

    static fromHsl(h: number, s: number, l: number): Color {
        const color = new Color();
        color.h = h;
        color.s = s;
        color.l = l;
        return color;
    }

    static fromHexString(hexString: string): Color {
        const color = new Color();
        color.fromHexString(hexString);
        return color;
    }

    static fromColor(color: Color): Color {
        const newColor = new Color();
        newColor.fromColor(color);
        return newColor;
    }

    lighten(amount: number): Color {
        this.l *= (1 + amount);
        return this;
    }

    darken(amount: number): Color {
        this.l *= (1 - amount);
        return this;
    }

    saturate(amount: number): Color {
        this.s *= (1 + amount);
        return this;
    }

    desaturate(amount: number): Color {
        this.s *= (1 - amount);
        return this;
    }

    toHexString(): string {
        return this.hex.toString();
    }

    toRgbString(): string {
        return this.rgb.toString();
    }

    toHslString(): string {
        return this.hsl.toString();
    }

    fromRgb(r: number, g: number, b: number): Color {
        const { rgb } = this;
        rgb.r = r;
        rgb.g = g;
        rgb.b = b;
        return this;
    }

    fromHsl(h: number, s: number, l: number): Color {
        const { hsl } = this;
        hsl.h = h;
        hsl.s = s;
        hsl.l = l;
        return this;
    }

    fromHexString(hexString: string): Color {
        this.hex.fromString(hexString);
        return this;
    }

    fromColor(color: Color): Color {
        this.r = color.r;
        this.g = color.g;
        this.b = color.b;
        return this;
    }
}
