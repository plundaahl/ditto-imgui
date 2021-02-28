import { StyledDittoContext } from '../../src/StyledDittoImGui';
import { bevelBox } from '../draw';
import { textLabel } from './textlabel';
import * as layout from '../layout';

const fontStyle = '16px monospace';

const debug = (window as any);

const beginExtButton = (
    g: StyledDittoContext,
    key: string,
    padding: number,
    border: number,
    ...constraints: {(): void}[]
) => {
    g.beginElement(key);
    g.draw.setFont(fontStyle);

    g.boxSize.border = border;
    g.boxSize.padding = padding;

    const edgeSpacing = (g.boxSize.border + g.boxSize.padding) * 2;
    const textMetrics = g.draw.measureText(key);
    const elemHeight = textMetrics.height + textMetrics.ascent + edgeSpacing;
    const elemWidth = textMetrics.width + edgeSpacing;

    debug.elemHeight = textMetrics;

    g.layout.addConstraints(
        layout.sizeHeightByDefaultPx(g, elemHeight),
        layout.sizeWidthByDefaultPx(g, elemWidth),
        ...constraints
    );

    g.layout.calculateLayout();
}

const endExtButton = (
    g: StyledDittoContext,
) => {
    g.layout.calculateLayout();
    const { x, y, w, h } = g.bounds.getElementBounds();
    const isHovered = g.mouse.hoversElement() || g.mouse.hoversChild();
    const isHot = isHovered && g.mouse.isM1Down();
    const isClicked = isHovered && g.mouse.isM1Clicked();
    const mode = isHot ? 'idle' : 'idle';

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
}

export const extButton = {
    begin: beginExtButton,
    end: endExtButton,
};

export const extTextButton = (
    g: StyledDittoContext,
    text: string,
    padding: number,
    border: number,
    ...constraints: {(): void}[]
) => {
    beginExtButton(g, text, padding, border, ...constraints);

    const isHovered = g.mouse.hoversElement() || g.mouse.hoversChild();
    const isHot = isHovered && g.mouse.isM1Down();
    const mode = isHot ? 'idle' : 'idle';

    textLabel(
        g,
        'label',
        text,
        0,
        g.theme.getColor('controlStd', mode, 'detail'),
        fontStyle,
        layout.fillParentVertically(g),
        layout.fillParentHorizontally(g),
    );
    return endExtButton(g);
};

export const button = (
    g: StyledDittoContext,
    text: string,
    ...constraints: {(): void}[]
) => {
    return extTextButton(g, text, 5, 2, ...constraints);
};

export const miniButton = (
    g: StyledDittoContext,
    text: string,
    ...constraints: {(): void}[]
) => {
    return extTextButton(g, text, 2, 2, ...constraints);
};
