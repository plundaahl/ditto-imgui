import { StyledDittoContextImpl } from '../../src/StyledDittoImGui';
import {
    panel,
    editableText,
} from '../widgets';

let text: string = 'foo bar baz';
const textBinding = (_ = text) => text = _;

export function textEditPlayground(gui: StyledDittoContextImpl) {
    panel.begin(gui, 'Example', 50, 50, 400, 200);
    editableText(
        gui,
        'Example',
        textBinding,
    );
    panel.end(gui);
}
