import { HslColor } from '../HslColor';

let instance: HslColor;

beforeEach(() => instance = new HslColor());

describe.each(['s', 'l'])('set %s', (property: 's' | 'l') => {
    test.each([
        [-255, 0],
        [-0.001, 0],
        [0, 0],
        [0.592, 0.592],
        [1, 1],
        [1.001, 1],
        [23, 1],
    ])(`given input %d, output of calling get ${property} should be %d`, (
        input: number, expected: number,
    ) => {
        instance[property] = input;
        expect(instance[property]).toBe(expected);
    });
});

describe('set h', () => {
    test.each([
        [-180, 180],
        [-720, 0],
        [-45, 315],
        [0, 0],
        [295, 295],
        [365.7, 5.7],
    ])('given input %d, output of calling get h should be %d', (
        input: number, expected: number,
    ) => {
        instance.h = input;
        expect(instance.h).toBeCloseTo(expected);
    });
});
