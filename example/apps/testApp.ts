import { StyledDittoContext } from '../../src/StyledDittoImGui';
import {
    background,
    panel,
    container,
    box,
    textLabel,
    WRAP,
} from '../test-widgets';
import * as layout from '../layout';

const RED = '#FF0000';

const params = (window as any);
params.nChildren = 17;
params.defaultWidth = 1;

export function testApp(g: StyledDittoContext, canvasMetrics: { w: number, h: number }) {
    g.boxSize.defaultPadding = 10;
    g.boxSize.defaultBorder = 1;

    background.begin(g, 'bg', canvasMetrics.w, canvasMetrics.h);
    g.layout.addChildConstraints(
        layout.edgesWithinParent(g),
        layout.belowLastSibling(g),
        layout.fillParentHorizontally(g),
    );

    textLabel(g, 'test', 'I am some text! Hear me roar', WRAP);
    textLabel(g, 'test2', 'A second label. Ho ho ho.');
    background.end(g);

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
            layout.fillParentHorizontally(g),
            layout.belowLastSibling(g),
        );

        textLabel(g, 'test', 'I am some text! Hear me roar', WRAP);
        textLabel(g, 'test2', 'A second label. Ho ho ho.');
    }
    container.end(g);

    panel.end(g);
}
