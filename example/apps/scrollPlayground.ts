import { StyledDittoContextImpl } from '../../src/StyledDittoImGui';
import {
    panel,
    editableText,
    scrollRegion,
    button,
    containerCollapsable,
} from '../widgets';

let nextBtnName: string = 'foo';
const nextBtnNameBinding = (_ = nextBtnName) => nextBtnName= _;

let buttons: string[] = [];

export function scrollPlayground(gui: StyledDittoContextImpl) {
    panel.begin(gui, 'Example', 50, 50, 400, 600);

    editableText(gui, 'Next Name', nextBtnNameBinding);
    if (button(gui, 'Add Button')) {
        buttons.push(nextBtnName);
    }

    containerCollapsable.begin(gui, 'buttons', true);
    scrollRegion.begin(gui, 'scroll');

    for (let i = 0; i < buttons.length; i++) {
        if (button(gui, `${i}-${buttons[i]}`)) {
            buttons = [ ...buttons.slice(0, i), ...buttons.slice(i + 1) ];
        }
    }

    scrollRegion.end(gui);
    containerCollapsable.end(gui);

    panel.end(gui);
}
