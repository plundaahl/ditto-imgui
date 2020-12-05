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
    row,
    menu,
    menuItem,
    subMenu,
} from './widgets';
import Color from '../src/lib/Color';

const { canvas, context } = setupCanvas();
const gui = new StyledDittoContextImpl(canvas, theme, boxSize, font);
let colors = convertThemeToColors(theme);

let menuOpen: boolean = false;
const menuOpenBinding = (_ = menuOpen) => menuOpen = _;

function main() {
    resetCanvas(context);

    panel.begin(gui, 'Menu Panel', 500, 50, 200, 100);
    if (button(gui, 'openmenu')) {
        menuOpenBinding(true);
    }
    if (menu.begin(gui, 'menu', 550, 80, 200, menuOpenBinding)) {
        if (subMenu.begin(gui, 'drink', 200)) {
            if (menuItem(gui, 'beer')) { console.log('beer'); }
            if (menuItem(gui, 'whiskey')) { console.log('whiskey'); }
            if (menuItem(gui, 'wine')) { console.log('wine'); }
        }
        subMenu.end(gui);

        if (subMenu.begin(gui, 'food', 200)) {
            if (menuItem(gui, 'cheese')) { console.log('cheese'); }
        }
        subMenu.end(gui);
    }
    menu.end(gui);
    panel.end(gui);

    panel.begin(gui, 'Control Panel', 50, 50, 300, 400);
    for (const r of regionTypes) {
        if (containerCollapsable.begin(gui, r, false)) {
            for (const m of modes) {
                if (containerCollapsable.begin(gui, m, false)) {
                    for (const a of themeAspects) {
                        colorSwatchEditable(gui, a, colors[r][m][a]);
                    }
                }
                containerCollapsable.end(gui);
            }
        }
        containerCollapsable.end(gui);
    }

    row.beginRow(gui, 'submissionrow', 2);
    row.beginCell(gui, 'apply');
    if (button(gui, 'apply', 'controlImportant')) {
        for (const r of regionTypes) {
            for (const m of modes) {
                for (const a of themeAspects) {
                    theme[r][m][a] = colors[r][m][a].toHexString();
                }
            }
        }
    }
    row.endCell(gui);

    row.beginCell(gui, 'cancel');
    if (button(gui, 'cancel', 'controlImportant')) {
        colors = convertThemeToColors(theme);
    }
    row.endCell(gui);
    row.endRow(gui);

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
