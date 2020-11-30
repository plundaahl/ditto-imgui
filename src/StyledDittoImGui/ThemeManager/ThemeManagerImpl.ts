import {
    Theme,
    ThemeManager,
} from './ThemeManager';

import {
    RegionType,
    Mode,
    ThemeAspect,
} from '../types';

export class ThemeManagerImpl implements ThemeManager {
    constructor(
        private readonly theme: Theme,
    ) {}

    getColor(regionType: RegionType, mode: Mode, aspect: ThemeAspect): string {
        return this.theme[regionType][mode][aspect];
    }
}
