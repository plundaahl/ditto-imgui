import { StyledDittoContext } from '../../src/StyledDittoImGui';
import {
    panel,
    button,
    container,
} from '../test-widgets';
import * as layout from '../layout';

export function testApp(g: StyledDittoContext, canvasMetrics: { w: number, h: number }) {
    g.boxSize.defaultPadding = 10;
    g.boxSize.defaultBorder = 1;

    panel.begin(g, 'testpanel', 200, 200, 400, 400);
    g.layout.addChildConstraints(
        layout.fillParentVertically(g),
        layout.fillParentHorizontally(g),
    );

    container.begin(g, 'cont');
    g.layout.addChildConstraints(
        layout.asColDown(g),
    );

    if (button(g, 'Foo')) {
        console.log('bar');
    }

    container.end(g);
    panel.end(g);
}
