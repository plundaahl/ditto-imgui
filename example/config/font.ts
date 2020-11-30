import { FontConfig, Font } from '../../src/StyledDittoImGui';

const baseFont: Font = {
    family: 'monospace',
    sizeInPoints: 11,
    style: 'normal',
};


export const font: FontConfig = {
    titlebar: {
        ...baseFont,
        style: 'bold',
    },
    panel: baseFont,
    controlStd: baseFont,
    controlDanger: baseFont,
    controlImportant: baseFont,
    editable: baseFont,
};
