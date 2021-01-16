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
params.direction = 0;
params.fixedWidth = true;
params.fixedHeight = false;
params.gridWidth = 80;
params.gridHeight = 4;

export function testApp(g: StyledDittoContext) {
    g.boxSize.defaultPadding = 10;
    g.boxSize.defaultBorder = 1;

    let gridFlags: number = 0;
    if (params.fixedWidth) { gridFlags |= layout.FIXED_WIDTH; }
    if (params.fixedHeight) { gridFlags |= layout.FIXED_HEIGHT; }
    if (params.direction === 0) {
        gridFlags |= layout.LEFT_TO_RIGHT;
    } else if (params.direction === 1) {
        gridFlags |= layout.RIGHT_TO_LEFT;
    } else if (params.direction === 2) {
        gridFlags |= layout.TOP_TO_BOTTOM;
    } else {
        gridFlags |= layout.BOTTOM_TO_TOP;
    }

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
            layout.asGridCell(g, gridFlags, params.gridWidth, params.gridHeight),
        );

        for (let i = 0; i < params.nChildren; i++) {
            box(g, `foo${i}`, RED);
        }
    }
    container.end(g);

    panel.end(g);
}
