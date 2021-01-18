import { StyledDittoContext } from '../../src/StyledDittoImGui';
import {
    panel,
    container,
    box,
} from '../test-widgets';
import * as layout from '../layout';

const RED = '#FF0000';

const params = (window as any);
params.nChildren = 17;
params.defaultWidth = 1;

export function testApp(g: StyledDittoContext) {
    g.boxSize.defaultPadding = 10;
    g.boxSize.defaultBorder = 1;

    panel.begin(g, 'testpanel', 200, 200, 400, 400);
    g.layout.addChildConstraints(
        layout.allDimensionsAtLeastZero(g),
        layout.edgesWithinParent(g),
    );

    for (let i = 0; i < params.nChildren; i++) {
        const size = ((((i * 11) + 1) % 6) * 10) + 10;
        box(g, `${i}-box`, RED,
            layout.belowLastSibling(g),
            layout.xFractionOfParent(g, 0),
            layout.heightExactly(g, size),
            layout.widthExactly(g, 100),
        );
    }

    container.begin(g, 'grid-container', RED,
        layout.fillRightOfLastSibling(g),
        layout.fillParentVertically(g),
    );
    {
        g.layout.addChildConstraints(
            layout.asGrid(g, 60, 40, layout.FIXED_WIDTH | layout.FIXED_HEIGHT)
        );

        for (let i = 0; i < params.nChildren; i++) {
            box(g, `gridcell-${i}`, RED);
        }
    }
    container.end(g);

    panel.end(g);
}
