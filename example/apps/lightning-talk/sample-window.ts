import { StyledDittoContext } from '../../../src/StyledDittoImGui';
import {
    panel,
    container,
    button,
} from '../../test-widgets';
import * as layout from '../../layout';

let nBoxes = 5;

export function sampleWindow(g: StyledDittoContext) {
    panel.begin(g, 'sample-window', 800, 100, 400, 500);

    g.layout.addChildConstraints(
        layout.fillParentHorizontally(g),
        layout.alignBelowLastSiblingByDefault(g),
    );

    container.begin(g, 'controls', 'RED', layout.heightAtLeast(g, 60));
    g.layout.addChildConstraints(
        layout.alignRightOfLastSibling(g),
        layout.fillParentVertically(g),
        layout.widthFractionOfParent(g, 0.5),
    );
    if (button(g, 'Add')) {
        nBoxes++;
    }
    if (button(g, 'Delete')) {
        nBoxes = Math.max(0, nBoxes - 1);
    }
    container.end(g);

    container.begin(g, 'results', 'RED', layout.fillBelowLastSibling(g));
    g.layout.addChildConstraints(
        layout.asGrid(g, 30, 30, layout.FIXED_WIDTH | layout.FIXED_HEIGHT),
    );
    for (let i = 0; i < nBoxes; i++) {
        button(g, `${i}`);
    }
    container.end(g);

    panel.end(g);
}
