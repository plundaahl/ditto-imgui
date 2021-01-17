import { StyledDittoContext } from '../../src/StyledDittoImGui';
import {
    panel,
    container,
    box,
} from '../test-widgets';
import * as layout from '../layout';

const RED = '#FF0000';

const params = (window as any);
params.nChildren = 4;
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
            layout.leftOfLastSibling(g),
            layout.heightExactly(g, size),
            layout.widthExactly(g, size),
        );
    }

    box(g, 'end', RED,
        layout.defaultHeightExactly(g, 50),
        layout.fillLeftOfLastSibling(g),
    );

    panel.end(g);
}
