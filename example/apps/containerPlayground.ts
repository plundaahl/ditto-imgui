import { StyledDittoContextImpl } from '../../src/StyledDittoImGui';
import {
    panel,
    extBoxBevelled,    
} from '../widgets';

export function containerPlayground(gui: StyledDittoContextImpl) {
    panel.begin(gui, 'Example', 50, 50, 400, 600);

    extBoxBevelled.begin(gui, 'TestBox');

    extBoxBevelled.begin(gui, 'InnerTest');
    gui.bounds.getElementBounds().w = 100;
    gui.bounds.getElementBounds().h = 50;
    extBoxBevelled.end(gui, 'controlStd', 'idle');

    extBoxBevelled.begin(gui, 'InnerTest2');
    gui.bounds.getElementBounds().h = 50;
    extBoxBevelled.end(gui, 'controlStd', 'idle');

    gui.bounds.getElementBounds().h = gui.bounds.getChildBounds().h
        + (gui.boxSize.getPadding() * 2)
        + (gui.boxSize.getBorderWidth() * 2);

    extBoxBevelled.end(gui, 'controlStd', 'idle');

    panel.end(gui);
}
