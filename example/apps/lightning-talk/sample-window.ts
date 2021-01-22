import { StyledDittoContext } from '../../../src/StyledDittoImGui';
import {
    panel,
    button,
} from '../../test-widgets';
import * as layout from '../../layout';

let nBoxes = 23;

export function sampleWindow(g: StyledDittoContext) {
    panel.begin(g, 'controls', 1000, 100, 400, 200);
    g.layout.addChildConstraints(
        layout.alignRightOfLastSibling(g),
        layout.alignTopFractionOfParent(g),
        layout.widthFractionOfParent(g, 0.5),
    );
    if (button(g, 'Add')) {
        nBoxes++;
    }
    if (button(g, 'Delete')) {
        nBoxes = Math.max(0, nBoxes - 1);
    }
    panel.end(g);

    panel.begin(g, 'output', 1200, 250, 300, 300);
    g.layout.addChildConstraints(
        layout.asGrid(g, 30, 30, layout.FIXED_WIDTH | layout.FIXED_HEIGHT),
    );
    for (let i = 0; i < nBoxes; i++) {
        button(g, `${i}`);
    }
    panel.end(g);
}
