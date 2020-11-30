import { RegionType } from '../types';
import { FontManager, FontConfig } from './FontManager';

export class FontManagerImpl implements FontManager {
    constructor(
        private readonly config: FontConfig,
    ) {}

    getFont(region: RegionType): string {
        const font = this.config[region]
        return `${font.style} ${font.sizeInPoints}pt ${font.family}`;
    }
}
