import Color from '../src/lib/Color';
import { Theme, RegionType, modes, regionTypes } from '../src/StyledDittoImGui';

const baseColors: { [R in RegionType]: string } = {
    panel: '#444',
    titlebar: '#085',
    controlStd: '#666',
    controlDanger: '#DDD',
    controlImportant: '#DDD',
    editable: '#FFF',
};

const highlightAmt = 0.75;
const lowlightAmt = 0.5;
const detail = '#FFF';
const bgSelect = '#555';
const detailSelect = '#FFF';

export const theme: Theme = (() => {
    let theme: any = {};
    for (const regionName of regionTypes) {
        theme[regionName] = {};

        for (const mode of modes) {
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

    theme.titlebar.idle.detail = '#0FA';
    theme.titlebar.focused.bg = '#0FA';
    theme.titlebar.focused.detail = '#000';

    return theme as unknown as Theme;
})();

(window as any).theme = theme;
