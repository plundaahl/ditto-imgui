import { StyledDittoContext } from '../../src/StyledDittoImGui';
import {
    panel,
    container,
    box,
} from '../test-widgets';
import * as layout from '../layout';

const RED = '#FF0000';

const params = (window as any);
params.nChildren = 9;
params.defaultWidth = 1;

export function testApp(g: StyledDittoContext) {
    g.boxSize.defaultPadding = 10;
    g.boxSize.defaultBorder = 1;

    panel.begin(g, 'testpanel', 200, 200, 400, 400);
    g.layout.addChildConstraints(
        layout.allDimensionsAtLeastZero(g),
        layout.widthAtMostFractionOfParent(g, 1),
        layout.heightAtMostSpaceBelowLastSibling(g),
        layout.defaultWidthFillsParent(g),
        layout.defaultXFractionOfParent(g, 0),
        layout.belowLastSibling(g),
    );

    box(g, 'foo', RED, layout.heightExactly(g, 50));
    box(g, 'bar', RED, layout.heightExactly(g, 50), layout.widthExactly(g, 80));
    container.begin(g, 'baz', RED, layout.heightExactly(g, 200));
    {
        g.layout.addChildConstraints(
            layout.allDimensionsAtLeastZero(g),
            layout.asGridCell(g, 4, 4),
        );

        for (let i = 0; i < params.nChildren; i++) {
            box(g, `foo${i}`, RED);
        }
    }
    container.end(g);

    panel.end(g);
}
