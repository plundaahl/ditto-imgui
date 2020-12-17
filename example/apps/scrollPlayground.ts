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
    panel.begin(gui, 'Example', 50, 50, 200, 200);

    editableText(gui, 'Next Name', nextBtnNameBinding);
    if (button(gui, 'Add Button')) {
        buttons.push(nextBtnName);
    }

    panel.end(gui);

    panel.begin(gui, 'Output', 300, 50, 150, 300);
    scrollRegion.begin(gui, 'scroll');

    for (let i = 0; i < buttons.length; i++) {
        if (button(gui, `${i}`)) {
            buttons = [ ...buttons.slice(0, i), ...buttons.slice(i + 1) ];
        }
    }

    scrollRegion.end(gui);
    panel.end(gui);
}
