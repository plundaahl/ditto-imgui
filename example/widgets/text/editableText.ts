import { StyledDittoContext } from '../../../src/StyledDittoImGui';
import { control } from '../macro';
import { extEditableText } from './extEditableText';

export function editableText(
    gui: StyledDittoContext,
    key: string,
    valueBinding: (t?: string) => string,
) {
    control.begin(gui, key);
    extEditableText(
        gui,
        'editableText',
        valueBinding,
        false,
        false,
    );
    control.end(gui);
}

