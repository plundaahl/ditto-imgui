import {
    Theme,
    ThemeManager,
    RegionType,
    Mode,
    Aspect,
} from './ThemeManager';

export class ThemeManagerImpl implements ThemeManager {
    constructor(
        private readonly theme: Theme,
    ) {}

    getColor(regionType: RegionType, mode: Mode, aspect: Aspect): string {
        return this.theme[regionType][mode][aspect];
    }
}
