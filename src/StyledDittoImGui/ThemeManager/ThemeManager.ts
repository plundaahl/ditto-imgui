import {
    RegionType,
    Mode,
    ThemeAspect,
} from '../types';

export type Theme = {
    [R in RegionType]: {
        [M in Mode]: {
            [A in ThemeAspect]: string;
        };
    };
};

export interface ThemeManager {
    getColor(regionType: RegionType, mode: Mode, aspect: ThemeAspect): string;
}
