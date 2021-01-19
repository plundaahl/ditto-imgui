import { StyledDittoContext } from '../../../src/StyledDittoImGui';
import { panel } from '../../test-widgets';

export function intro(
    g: StyledDittoContext,
) {
    panel.begin(g, 'testpanel', 200, 200, 400, 400);
    panel.end(g);
}
