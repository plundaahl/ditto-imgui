import Color from '../../src/lib/Color';
import { Theme } from '../../src/StyledDittoImGui';

const DARK_METAL = '#222';
const BRIGHT_METAL = '#666';
const WHITE = '#FFF';
const BLACK = '#000';
const DARK_TEAL = '#085';
const BRIGHT_TEAL = '#5FA';

const baseHighlight = 0.75;
const baseLowlight = 0.5;

const darkMetal = mkTheme(DARK_METAL, WHITE, 1.5);
const brightMetal = mkTheme(BRIGHT_METAL, WHITE);

const darkTeal = mkTheme(DARK_TEAL, WHITE);
const brightTeal = mkTheme(BRIGHT_TEAL, BLACK);

const editableMetal = withInverseBevel(
    withBg(
        withDetail(brightMetal, BLACK), WHITE));

export const theme: Theme = {
    panel: {
        idle: { ...darkMetal },
        focused: { ...withDetail(darkMetal, BRIGHT_TEAL) },
        active: { ...darkMetal },
        disabled: { ...darkMetal },
    },
    titlebar: {
        idle: { ...darkTeal },
        focused: { ...brightTeal },
        active: { ...brightTeal },
        disabled: { ...darkTeal },
    },
    controlStd: {
        idle: { ...brightMetal },
        focused: { ...darkTeal },
        active: { ...withInverseBevel(darkTeal) },
        disabled: { ...brightMetal },
    },
    controlDanger: {
        idle: { ...brightMetal },
        focused: { ...brightMetal },
        active: { ...withInverseBevel(brightMetal) },
        disabled: { ...brightMetal },
    },
    controlImportant: {
        idle: { ...brightMetal },
        focused: { ...brightMetal },
        active: { ...withInverseBevel(brightMetal) },
        disabled: { ...brightMetal },
    },
    editable: {
        idle: { ...editableMetal },
        focused: { ...editableMetal },
        active: { ...editableMetal },
        disabled: { ...editableMetal },
    },
}

interface RegionTheme {
    bg: string,
    bgHighlight: string,
    bgLowlight: string,
    bgSelected: string,
    detail: string,
    detailSelected: string,
}

function mkTheme(
    bg: string,
    detail: string,
    contrast: number = 1,
): RegionTheme {
    const highlight = baseHighlight * contrast;
    const lowlight = baseLowlight * contrast;

    return {
        bg,
        bgHighlight: Color.fromHexString(bg).lighten(highlight).toHexString(),
        bgLowlight: Color.fromHexString(bg).darken(lowlight).toHexString(),
        bgSelected: bg,
        detail,
        detailSelected: detail,
    };
}

function withInverseBevel(input: RegionTheme): RegionTheme {
    return {
        ...input,
        bgHighlight: input.bgLowlight,
        bgLowlight: input.bgHighlight,
    };
}

function withBg(input: RegionTheme, bg: string): RegionTheme {
    return { ...input, bg, bgSelected: bg };
}

function withDetail(input: RegionTheme, detail: string): RegionTheme {
    return { ...input, detail, detailSelected: detail };
}
