import { StyledDittoContext } from '../../src/StyledDittoImGui';
import {
    panel,
    container,
    box,
} from '../test-widgets';
import * as layout from '../layout';

const RED = '#FF0000';

const params = (window as any);
params.appWidth = 400;
params.appHeight = 400;

export function testApp(g: StyledDittoContext) {
    panel.begin(g, 'testpanel',
        layout.xOf(g, 200),
        layout.yOf(g, 200),
        layout.widthOf(g, params.appWidth),
        layout.heightOf(g, params.appHeight),
    );
    g.layout.addChildConstraints(
        layout.widthFillsParent(g),
        layout.belowLastSibling(g),
    );

    box(g, 'foo', RED, layout.heightOf(g, 50));
    box(g, 'bar', RED, layout.heightOf(g, 50), layout.widthOf(g, 80));
    container.begin(g, 'baz', RED, layout.heightOf(g, 200));
    {
        g.layout.addChildConstraints(
            layout.widthPercentOfParent(g, 0.25),
            layout.heightOf(g, 50),
            layout.yOf(g, 340),
        );

        box(g, 'foo', RED, layout.xPercentOfParent(g, 0));
        box(g, 'bar', RED, layout.xPercentOfParent(g, 0.25));
        box(g, 'bar', RED, layout.xPercentOfParent(g, 0.5));
        box(g, 'bar', RED, layout.xPercentOfParent(g, 0.75));
    }
    container.end(g);

    panel.end(g);
}
