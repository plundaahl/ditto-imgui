import Color from '../src/lib/Color';
import { Theme, regions, modes } from '../src/StyledDittoImGui';

const baseColors: { [R in keyof typeof regions]: string } = {
    panel: '#DDD',
    titlebar: '#0FB',
    controlStd: '#DDD',
    controlDanger: '#DDD',
    controlImportant: '#DDD',
    editable: '#FFF',
};

const highlightAmt = 0.2;
const lowlightAmt = 0.2;
const detail = '#000';
const bgSelect = '#555';
const detailSelect = '#FFF';

export const theme: Theme = (() => {
    let theme: any = {};
    for (const regionName in regions) {
        theme[regionName] = {};

        for (const mode in modes) {
            theme[regionName][mode] = {};

            const colorHex = (baseColors as any)[regionName];
            const color = Color.fromHexString(colorHex);

            theme[regionName][mode].bg = color.toHexString();

            theme[regionName][mode].bgHighlight = color
                .fromHexString(colorHex)
                .lighten(highlightAmt)
                .toHexString();

            theme[regionName][mode].bgLowlight = color
                .fromHexString(colorHex)
                .darken(lowlightAmt)
                .toHexString();

            theme[regionName][mode].bgSelected = bgSelect;
            theme[regionName][mode].detail = detail;
            theme[regionName][mode].detailSelect = detailSelect;
        }
    }
    return theme as unknown as Theme;
})();
