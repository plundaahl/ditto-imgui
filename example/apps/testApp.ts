import { StyledDittoContext } from '../../src/StyledDittoImGui';
import {
    panel,
    box,
} from '../test-widgets';
import * as layout from '../layout';
import { offsetFromParentFlags as f } from '../layout/offsetFromParent';

const RED = '#FF0000';

const params = (window as any);
params.nChildren = 17;

export function testApp(g: StyledDittoContext, canvasMetrics: { w: number, h: number }) {
    g.boxSize.defaultPadding = 10;
    g.boxSize.defaultBorder = 1;

    panel.begin(g, 'testpanel', 200, 200, 400, 400);
    g.layout.addChildConstraints(
        layout.allDimensionsAtLeastZero(g),
        layout.edgesWithinParent(g),
    );

    for (let i = 0; i < 4; i++) {
        box(g, `some-box-${i}`, RED,
            layout.alignLeftAmountFromParent(g),
            layout.offsetFromParent(
                g,
                f.VERTICAL | f.ALIGN_END | f.TO_PARENT_END | f.BY_VALUE,
                (i * -100),
            ),
            layout.heightExactly(g, 100),
            layout.widthFractionOfParent(g, 0.25),
        );
    }

    panel.end(g);
}
