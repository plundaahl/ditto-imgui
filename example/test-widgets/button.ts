import { StyledDittoContext } from '../../src/StyledDittoImGui';
import { textLabel } from './textlabel';
import * as layout from '../layout';

const fontStyle = '16px monospace';

export const button = (
    g: StyledDittoContext,
    text: string,
    ...constraints: {(): void}[]
) => {
    g.beginElement(text);
    g.draw.setFont(fontStyle);

    const edgeSpacing = g.boxSize.totalSpacing * 2;
    const textMetrics = g.draw.measureText(text);
    const elemHeight = textMetrics.height + edgeSpacing;
    const elemWidth = textMetrics.width + edgeSpacing;

    g.layout.addConstraints(
        layout.heightDefaultAmount(g, elemHeight),
        layout.widthDefaultAmount(g, elemWidth),
        ...constraints
    );
    g.layout.addChildConstraints(
        layout.fillParentVertically(g),
        layout.fillParentHorizontally(g),
    );
    g.layout.calculateLayout();
    const { x, y, w, h } = g.bounds.getElementBounds();

    const isHovered = g.mouse.hoversElement() || g.mouse.hoversChild();
    const isHot = isHovered && g.mouse.isM1Down();
    const isClicked = isHovered && g.mouse.isM1Clicked();

    const mode = isHot ? 'active' : 'idle';

    g.draw.setFillStyle(g.theme.getColor('controlStd', mode, 'bg'));
    g.draw.fillRect(x, y, w, h);
    textLabel(
        g,
        'label',
        text,
        0,
        g.theme.getColor('controlStd', mode, 'detail'),
        fontStyle,
    );

    g.endElement();
    return isClicked;
};
