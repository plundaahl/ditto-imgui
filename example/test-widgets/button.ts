import { StyledDittoContext } from '../../src/StyledDittoImGui';
import { bevelBox } from '../draw';
import { textLabel } from './textlabel';
import * as layout from '../layout';

const fontStyle = '16px monospace';
const regularBtnBorder = 2;
const regularBtnPadding = 5;
const miniBtnBorder = 2;
const miniBtnPadding = 2;

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

    g.layout.addConstraints(...constraints);
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
    icon: string,
    padding: number,
    border: number,
    ...constraints: {(): void}[]
) => {
    beginExtButton(g, text, padding, border);

    const edgeSpacing = (g.boxSize.border + g.boxSize.padding) * 2;
    const textMetrics = g.draw.measureText(text);
    const elemHeight = textMetrics.height + textMetrics.descent + edgeSpacing;
    const elemWidth = textMetrics.width + edgeSpacing;

    g.layout.addConstraints(
        layout.sizeHeightByDefaultPx(g, elemHeight),
        layout.sizeWidthByDefaultPx(g, elemWidth),
        ...constraints
    );
    g.layout.addChildConstraints(
        layout.asRowLeft(g),
    );
    g.layout.calculateLayout();

    const textColor = g.theme.getColor('controlStd', 'idle', 'detail');
    // draw icon
    if (icon !== '') {
        textLabel(
            g,
            'icon',
            icon,
            0,
            textColor,
            fontStyle,
            layout.sizeWidthByPx(g, g.draw.measureText(icon).width),
        );
    }

    // draw text
    textLabel(
        g,
        'label',
        text,
        0,
        textColor,
        fontStyle,
        layout.fillLeftOfLastSibling(g),
    );

    return endExtButton(g);
};

export const buttonWithIcon = (
    g: StyledDittoContext,
    text: string,
    icon: string = '',
    ...constraints: {(): void}[]
) => {
    return extTextButton(g, text, icon, regularBtnPadding, regularBtnBorder, ...constraints);
};

export const button = (
    g: StyledDittoContext,
    text: string,
    ...constraints: {(): void}[]
) => {
    return extTextButton(g, text, '', regularBtnPadding, regularBtnBorder, ...constraints);
};

export const miniButton = (
    g: StyledDittoContext,
    text: string,
    ...constraints: {(): void}[]
) => {
    return extTextButton(g, text, '', miniBtnPadding, miniBtnBorder, ...constraints);
};
