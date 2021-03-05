import { StyledDittoContext } from '../../src/StyledDittoImGui';
import { textLabel } from './textlabel';
import { region } from './region';
import { bevelBox } from '../draw/box';
import * as layout from '../layout';

const BORDER = 2;
const PADDING = 2;
const CHECKMARK = '✓';
const fontStyle = '16px monospace';

const drawCheckbox = (
    g: StyledDittoContext,
    key: string,
    checked: boolean,
    ...constraints: {(): void}[]
) => {
    g.beginElement(key);

    // calculate size and constraints
    g.boxSize.border = BORDER;
    g.boxSize.padding = PADDING;

    const dimension = g.draw.measureText(CHECKMARK).height +
        ((g.boxSize.border + g.boxSize.padding) * 2);

    g.layout.addConstraints(
        layout.sizeWidthByPx(g, dimension),
        layout.sizeHeightByPx(g, dimension),
        ...constraints
    );
    g.layout.addChildConstraints(
        layout.fillParentVertically(g),
        layout.fillParentHorizontally(g),
    );
    g.layout.calculateLayout();

    // draw checkmark
    if (checked) {
        textLabel(
            g,
            'checkmark',
            CHECKMARK,
            0,
            g.theme.getColor('editable', 'idle', 'detail'),
            fontStyle,
        );
    }

    // draw box
    const { x, y, w, h } = g.bounds.getElementBounds();
    bevelBox(g, x, y, w, h, BORDER, 'editable', 'idle');

    g.endElement();
};

export const checkbox = (
    g: StyledDittoContext,
    label: string,
    checked: boolean,
    ...constraints: {(): void}[]
): boolean => {
    region.begin(g, label);
    g.boxSize.padding = 0;
    g.boxSize.border = 0;

    g.layout.addConstraints(
        ...constraints,
        layout.collapseToChildren(g),
    );
    g.layout.calculateLayout();

    // Draw checkbox
    drawCheckbox(g, 'checkbox', checked, layout.asRowRight(g));
    g.layout.calculateLayout();

    // Wrap label for padding purposes
    region.begin(g, 'label-wrapper');
    g.boxSize.padding = PADDING;
    g.layout.addConstraints(
        layout.asRowRight(g),
        layout.collapseToChildren(g),
    );
    g.layout.calculateLayout();

    // Draw label
    g.draw.setFont(fontStyle);
    textLabel(
        g,
        'label',
        label,
        0,
        g.theme.getColor('panel', 'idle', 'detail'),
        fontStyle,
        layout.fillParentVertically(g),
        layout.offsetPosFromParentLeftByPx(g, PADDING * 2),
        layout.sizeWidthByPx(g, g.draw.measureText(label).width),
    );

    region.end(g);

    // g.layout.addConstraints(layout.collapseToChildren(g));
    g.layout.calculateLayout();

    // Get updated value
    const hoversElementOrChildren = g.mouse.hoversChild();
    const clicked = g.mouse.isM1Clicked();
    const newValue = hoversElementOrChildren && clicked
        ? !checked
        : checked;

    region.end(g);
    return newValue;
};
