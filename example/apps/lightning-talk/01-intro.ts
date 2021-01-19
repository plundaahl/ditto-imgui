import { StyledDittoContext } from '../../../src/StyledDittoImGui';
import { panel, button } from '../../test-widgets';
import * as layout from '../../layout';

export function intro(
    g: StyledDittoContext,
) {
    panel.begin(g, 'testpanel', 200, 200, 400, 400);
    g.layout.addChildConstraints(
        layout.fillParentHorizontally(g),
        layout.belowLastSibling(g),
    );

    if (button(g, 'foofoofoo')) {
        console.log('woke');
    }

    panel.end(g);
}
