import { StyledDittoContext } from '../../src/StyledDittoImGui';
import {
    panel,
    box,
} from '../test-widgets';
import * as layout from '../layout';

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
            layout.offsetFromParentLeftByFraction(g, i * 0.25),
            layout.offsetFromParentTop(g),
            layout.heightExactlyFractionOfParent(g, 0.25),
            layout.widthAtMostAmount(g, 100),
            layout.widthExactlyFractionOfParent(g, 0.25),
        );
    }

    panel.end(g);
}
