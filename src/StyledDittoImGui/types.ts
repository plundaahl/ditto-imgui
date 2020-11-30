export type RegionType = 'titlebar'
    | 'panel' 
    | 'controlStd' 
    | 'controlImportant' 
    | 'controlDanger' 
    | 'editable';
export const regionTypes: RegionType[] = [
    'titlebar',
    'panel',
    'controlStd',
    'controlImportant',
    'controlDanger',
    'editable',
];

export type Mode = 'idle'
    | 'focused'
    | 'active'
    | 'disabled';
export const modes: Mode[] = [
    'idle',
    'focused',
    'active',
    'disabled',
];

export type ThemeAspect = 'bg'
    | 'bgHighlight'
    | 'bgLowlight'
    | 'bgSelected'
    | 'detail'
    | 'detailSelected';
export const themeAspects: ThemeAspect[] = [
    'bg',
    'bgHighlight',
    'bgLowlight',
    'bgSelected',
    'detail',
    'detailSelected',
];
