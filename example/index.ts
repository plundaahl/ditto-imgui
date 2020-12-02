import { run } from './runner';
import { theme, boxSize, font } from './config';
import { setupCanvas, resetCanvas } from './util';
import {
    StyledDittoContextImpl,
    RegionType,
    Mode,
    ThemeAspect,
    Theme,
    regionTypes,
    modes,
    themeAspects,
} from '../src/StyledDittoImGui';
import {
    panel,
    colorSwatchEditable,
    containerCollapsable,
    button,
} from './widgets';
import Color from '../src/lib/Color';

const { canvas, context } = setupCanvas();
const gui = new StyledDittoContextImpl(canvas, theme, boxSize, font);
let colors = convertThemeToColors(theme);

function main() {
    resetCanvas(context);

    panel.begin(gui, 'Control Panel', 50, 50, 300, 400);

    for (const r of regionTypes) {
        if (containerCollapsable.begin(gui, r, false)) {
            for (const m of modes) {
                if (containerCollapsable.begin(gui, m, false)) {
                    for (const a of themeAspects) {
                        colorSwatchEditable(gui, a, colors[r][m][a], true);
                    }
                }
                containerCollapsable.end(gui);
            }
        }
        containerCollapsable.end(gui);
    }

    if (button(gui, 'apply', 'controlImportant')) {
        for (const r of regionTypes) {
            for (const m of modes) {
                for (const a of themeAspects) {
                    theme[r][m][a] = colors[r][m][a].toHexString();
                }
            }
        }
    }

    if (button(gui, 'cancel', 'controlImportant')) {
        colors = convertThemeToColors(theme);
    }

    panel.end(gui);

    gui.render();
}

function convertThemeToColors(theme: Theme, colors: any = {}) {
    for (const r of regionTypes) {
        colors[r] = {};
        for (const m of modes) {
            colors[r][m] = {};
            for (const a of themeAspects) {
                colors[r][m][a] = Color.fromHexString(theme[r][m][a]);
            }
        }
    }

    return colors as {
        [key in RegionType]: {
            [key in Mode]: {
                [key in ThemeAspect]: Color;
            };
        };
    };
}

run(main);
