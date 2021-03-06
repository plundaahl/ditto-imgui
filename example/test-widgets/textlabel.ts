import { StyledDittoContext } from '../../src/StyledDittoImGui';
import { flagFactory } from '../../src/DittoImGui/lib/FlagFactory';
import { TextPainter } from './TextPainter';
import * as layout from '../layout';

const font = 'monospace';
const fontHeading = `48px ${font}`;
const fontSubHeading = `32px ${font}`;
const fontText = `32px ${font}`;

const textPainterMap = new Map<StyledDittoContext, TextPainter>();
function getTextPainter(g: StyledDittoContext): TextPainter {
    const painter = textPainterMap.get(g) || new TextPainter(g);
    textPainterMap.set(g, painter);
    return painter;
}

const flag = flagFactory();
export const WRAP = flag();

export const textLabel = (
    g: StyledDittoContext,
    key: string,
    text: string,
    flags: number = 0,
    color: string = 'black',
    style: string = '16px monospace',
    ...constraints: {(): void}[]
) => {
    g.beginElement(key);
    g.layout.addConstraints(...constraints);
    g.layout.calculateLayout();

    g.draw.setFont(style);

    const { x, y, w } = g.bounds.getElementBounds();
    const builder = getTextPainter(g).startBuilder(text, x, y, color);
    if (flags & WRAP) {
        builder.withMultiline();
        builder.withWordWrap(w);
    }
    const textPainter = builder.build();

    g.layout.addConstraints(
        layout.sizeHeightByDefaultPx(g, textPainter.getHeight()),
    );

    g.layout.calculateLayout();
    textPainter.paint();

    g.endElement();
};

export const heading = (
    g: StyledDittoContext,
    key: string,
    text: string,
    ...constraints: {(): void}[]
) => {
    textLabel(
        g,
        key,
        text,
        WRAP,
        'black',
        fontHeading,
        ...constraints);
}

export const subheading = (
    g: StyledDittoContext,
    key: string,
    text: string,
    ...constraints: {(): void}[]
) => {
    textLabel(
        g,
        key,
        text,
        WRAP,
        'black',
        fontSubHeading,
        ...constraints);
}

export const text = (
    g: StyledDittoContext,
    key: string,
    text: string,
    ...constraints: {(): void}[]
) => {
    textLabel(
        g,
        key,
        text,
        WRAP,
        'black',
        fontText,
        ...constraints);
}
