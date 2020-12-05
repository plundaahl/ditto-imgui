import { StyledDittoContext } from '../../../src/StyledDittoImGui';
import { extSlider } from './extSlider';
import { control } from '../macro';

export function slider(
    gui: StyledDittoContext,
    title: string,
    valueBinding: (v?: number) => number,
    min: number,
    max: number,
    constraintFn?: (v: number) => number,
) {
    control.begin(gui, title);
    extSlider.begin(gui, title, valueBinding, min, max, constraintFn);
    extSlider.end(gui);
    control.end(gui);
}
