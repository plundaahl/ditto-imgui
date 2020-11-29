export const regions = {
    titlebar: 'titlebar',
    panel: 'panel',
    controlStd: 'controlStd',
    controlImportant: 'controlImportant',
    controlDanger: 'controlDanger',
    editable: 'editable',
};

export const modes = {
    idle: 'idle',
    focused: 'focused',
    active: 'active',
    disabled: 'disabled',
};

export const aspects = {
    bg: 'bg',
    bgHighlight: 'bgHighlight',
    bgLowlight: 'bgLowlight',
    bgSelected: 'bgSelected',
    detail: 'detail',
    detailSelected: 'detailSelected',
};

export type RegionType = keyof typeof regions;
export type Mode = keyof typeof modes;
export type Aspect = keyof typeof aspects;

export type Theme = {
    [R in keyof typeof regions]: {
        [M in keyof typeof modes]: {
            [A in keyof typeof aspects]: string;
        };
    };
};

export interface ThemeManager {
    getColor(regionType: RegionType, mode: Mode, aspect: Aspect): string;
}
