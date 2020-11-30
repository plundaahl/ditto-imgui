import Color from '../../src/lib/Color';
import { Theme, RegionType, modes, regionTypes } from '../../src/StyledDittoImGui';

const baseHighlight = 0.75;
const baseLowlight = 0.5;

const darkMetal = mkTheme('#222', '#FFF');
const brightMetal = mkTheme('#666', '#FFF');

const darkTeal = mkTheme('#085', '#FFF');
const brightTeal = mkTheme('#5FA', '#000');

const editableMetal = withInverseBevel(
    withBg(
        withDetail(brightMetal, '#000'), '#FFF'));

export const theme: Theme = {
    panel: {
        idle: { ...darkMetal },
        focused: { ...darkMetal },
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
        focused: { ...brightMetal },
        active: { ...withInverseBevel(brightMetal) },
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
