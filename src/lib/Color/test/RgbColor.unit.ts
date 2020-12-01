import { HslColor } from '../HslColor';
import { RgbColor } from '../RgbColor';

describe('rgb -> hsl conversion', () => {
    describe.each([
        [0, 0, 0, 0, 0, 0], // black
        [255, 255, 255, 0, 0, 1], // white
        [255, 0, 0, 0, 1, 0.5], // red
        [0, 255, 0, 120, 1, 0.5], // lime
        [0, 0, 255, 240, 1, 0.5], // blue
        [255, 255, 0, 60, 1, 0.5], // yellow
        [0, 255, 255, 180, 1, 0.5], // cyan
        [255, 0, 255, 300, 1, 0.5], // magenta
        [191, 191, 191, 0, 0, 0.75], // silver
        [128, 128, 128, 0, 0, 0.5], // gray
        [128, 0, 0, 0, 1, 0.25], // maroon
        [128, 128, 0, 60, 1, 0.25], // olive
        [0, 128, 0, 120, 1, 0.25], // green
        [128, 0, 128, 300, 1, 0.25], // purple
        [0, 128, 128, 180, 1, 0.25], // teal
        [0, 0, 128, 240, 1, 0.25], // navy
    ])('given rgb %d %d %d', (
        r: number, g: number, b: number, expH: number, expS: number, expL: number,
    ) => {

        test(`using the constructor should set internal hsl to ${expH} ${expS} ${expL}`, () => {
            const color = new RgbColor(r, g, b);
            const core: HslColor = (color as any).data;

            expect(core.h).toBeCloseTo(expH);
            expect(core.s).toBeCloseTo(expS);
            expect(core.l).toBeCloseTo(expL);
        });

        test(`setting these values manually should set internal hsl to ${expH} ${expS} ${expL}`, () => {
            const color = new RgbColor();
            const core: HslColor = (color as any).data;

            color.r = r;
            color.g = g;
            color.b = b;

            expect(core.h).toBeCloseTo(expH);
            expect(core.s).toBeCloseTo(expS);
            expect(core.l).toBeCloseTo(expL);
        });
    });
});

describe('hsl -> rgb conversion', () => {
    describe.each([
        [0, 0, 0, 0, 0, 0], // black
        [0, 0, 1, 255, 255, 255], // white
        [0, 1, 0.5, 255, 0, 0], // red
        [120, 1, 0.5, 0, 255, 0], // lime
        [240, 1, 0.5, 0, 0, 255], // blue
        [60, 1, 0.5, 255, 255, 0], // yellow
        [180, 1, 0.5, 0, 255, 255], // cyan
        [300, 1, 0.5, 255, 0, 255], // magenta
        [0, 0, 0.75, 191, 191, 191], // silver
        [0, 0, 0.5, 128, 128, 128], // gray
        [0, 1, 0.25, 128, 0, 0], // maroon
        [60, 1, 0.25, 128, 128, 0], // olive
        [120, 1, 0.25, 0, 128, 0], // green
        [300, 1, 0.25, 128, 0, 128], // purple
        [180, 1, 0.25, 0, 128, 128], // teal
        [240, 1, 0.25, 0, 0, 128], // navy
    ])('given hsl %d %d %d', (
        h: number, s: number, l: number, expR: number, expG: number, expB: number,
    ) => {
        let core: HslColor;
        let color: RgbColor;
        
        beforeEach(() => {
            core = new HslColor();

            core.h = h;
            core.s = s;
            core.l = l;

            color = new RgbColor(core);
        });
        
        test(`get r, g, b should return ${expR} ${expG} ${expB}`, () => {
            expect(color.r).toBeCloseTo(expR);
            expect(color.g).toBeCloseTo(expG);
            expect(color.b).toBeCloseTo(expB);
        });

        test(`toString should return "rgb(${expR},${expG},${expB})"`, () => {
            expect(color.toString()).toBe(`rgb(${expR},${expG},${expB})`);
        });
    });
});

