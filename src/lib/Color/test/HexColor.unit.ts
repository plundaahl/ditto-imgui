import { RgbColor } from '../RgbColor';
import { HexColor } from '../HexColor';

describe('fromString', () => {
    let core: RgbColor;
    let instance: HexColor;

    beforeEach(() => {
        core = new RgbColor();
        instance = new HexColor(core);
    });

    test.each([
        ['#000', 0, 0, 0],
        ['#F00', 255, 0, 0],
        ['#0F0', 0, 255, 0],
        ['#00F', 0, 0, 255],
        ['#FF00FF', 255, 0, 255],
    ])('given hex code %s, should have rgb %d, %d, %d', (
        code: string,
        r: number,
        g: number,
        b: number,
    ) => {
        instance.fromString(code);

        expect(core.r).toBe(r);
        expect(core.g).toBe(g);
        expect(core.b).toBe(b);
    });
});

describe('toString', () => {
    let core: RgbColor;
    let instance: HexColor;

    beforeEach(() => {
        core = new RgbColor();
        instance = new HexColor(core);
    });

    test.each([
        [0, 0, 0, '#000000'],
        [255, 0, 0, '#ff0000'],
        [0, 255, 0, '#00ff00'],
        [0, 0, 255, '#0000ff'],
        [255, 0, 255, '#ff00ff'],
    ])('given rgb %d, %d, %d, should return %s', (
        r: number,
        g: number,
        b: number,
        expectedString: string,
    ) => {
        core.r = r;
        core.g = g;
        core.b = b;

        expect(instance.toString()).toBe(expectedString);
    });
});
