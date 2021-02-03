import { StyledDittoContext } from '../../src/StyledDittoImGui';
import {
    panel,
    box,
    container,
} from '../test-widgets';
import * as layout from '../layout';

const RED = '#FF0000';

const params = (window as any);
params.nChildren = 5;

export function testApp(g: StyledDittoContext, canvasMetrics: { w: number, h: number }) {
    g.boxSize.defaultPadding = 10;
    g.boxSize.defaultBorder = 1;

    panel.begin(g, 'testpanel', 200, 200, 400, 400);
    g.layout.addChildConstraints(layout.edgesWithinParent(g));
    container.begin(g, 'container', RED,
        layout.fillParentVerticallyByDefault(g),
        layout.fillParentHorizontallyByDefault(g),
    );

    g.layout.addChildConstraints(
        layout.edgesWithinParent(g),
        layout.sizeHeightByAtMostPx(g, 200),
        layout.asRowRight(g),
    );
    for (let i = 0; i < params.nChildren; i++) {
        box(g, `box-${i}`, RED,
            layout.sizeHeightByPx(g, 50),
            layout.sizeWidthByPx(g, 50),
        );
    }

    g.layout.addConstraints(
        layout.collapseToChildren(g),
    );

    container.end(g);
    panel.end(g);
}
