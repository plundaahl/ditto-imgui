import { StyledDittoContextImpl } from '../../src/StyledDittoImGui';
import {
    panel,
    editableText,
    editableNumber,
} from '../widgets';

let text: string = 'foo bar baz';
const textBinding = (_ = text) => text = _;

let num: number = 3.14;
const numBinding = (_ = num) => num = _;

export function textEditPlayground(gui: StyledDittoContextImpl) {
    panel.begin(gui, 'Example', 50, 50, 400, 200);
    editableText(gui, 'Editor A', textBinding);
    editableText(gui, 'Editor B', textBinding);
    editableNumber(gui, 'Num Edit A', numBinding, Math.ceil);
    editableNumber(gui, 'Num Edit B', numBinding);
    panel.end(gui);
}
