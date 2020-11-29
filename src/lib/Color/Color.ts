import { ColorCore } from './ColorCore';
import { HexColor } from './HexColor';
import { RgbColor } from './RgbColor';

export class Color {
    private readonly rgb: RgbColor;
    private readonly hex: HexColor;

    constructor() {
        const core = new ColorCore();
        this.rgb = new RgbColor(core);
        this.hex = new HexColor(core);
    }

    get r(): number { return this.rgb.r; }
    set r(v: number) { this.rgb.r = v; }
    get g(): number { return this.rgb.g; }
    set g(v: number) { this.rgb.g = v; }
    get b(): number { return this.rgb.b; }
    set b(v: number) { this.rgb.b = v; }

    static fromRgb(r: number, g: number, b: number): Color {
        const color = new Color();
        color.r = r;
        color.g = g;
        color.b = b;
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
        this.r *= (1 + amount);
        this.g *= (1 + amount);
        this.b *= (1 + amount);
        return this;
    }

    darken(amount: number): Color {
        this.r *= (1 - amount);
        this.g *= (1 - amount);
        this.b *= (1 - amount);
        return this;
    }

    toHexString(): string {
        return this.hex.toString();
    }

    toRgbString(): string {
        return this.rgb.toString();
    }

    fromRgb(r: number, g: number, b: number): Color {
        const { rgb } = this;
        rgb.r = r;
        rgb.g = g;
        rgb.b = b;
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
