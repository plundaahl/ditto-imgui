import { StyledDittoContext } from '../../src/StyledDittoImGui';
import { bevelBox } from '../draw';
import { textLabel } from './textlabel';
import * as layout from '../layout';

const fontStyle = '16px monospace';

const debug = (window as any);

export const button = (
    g: StyledDittoContext,
    text: string,
    ...constraints: {(): void}[]
) => {
    g.beginElement(text);
    g.draw.setFont(fontStyle);

    g.boxSize.border = 2;
    g.boxSize.padding = 5;

    const edgeSpacing = (g.boxSize.border + g.boxSize.padding) * 2;
    const textMetrics = g.draw.measureText(text);
    const elemHeight = textMetrics.height + textMetrics.ascent + edgeSpacing;
    const elemWidth = textMetrics.width + edgeSpacing;
    const isHovered = g.mouse.hoversElement() || g.mouse.hoversChild();
    const isHot = isHovered && g.mouse.isM1Down();
    const isClicked = isHovered && g.mouse.isM1Clicked();
    const mode = isHot ? 'idle' : 'idle';

    debug.elemHeight = textMetrics;

    g.layout.addConstraints(
        layout.sizeHeightByDefaultPx(g, elemHeight),
        layout.sizeWidthByDefaultPx(g, elemWidth),
        ...constraints
    );
    g.layout.addChildConstraints(
        layout.fillParentVertically(g),
        layout.fillParentHorizontally(g),
    );

    g.layout.calculateLayout();
    textLabel(
        g,
        'label',
        text,
        0,
        g.theme.getColor('controlStd', mode, 'detail'),
        fontStyle,
    );

    g.layout.calculateLayout();

    const { x, y, w, h } = g.bounds.getElementBounds();
    bevelBox(
        g,
        x,
        y,
        w,
        h,
        g.boxSize.border,
        'controlStd',
        mode,
        isHot,
    );

    g.endElement();
    return isClicked;
};
