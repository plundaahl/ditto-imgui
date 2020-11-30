import { RegionType, Mode } from '../types';

export interface Font {
    family: string,
    sizeInPoints: number,
    style: 'normal' | 'bold' | 'italic' | 'bold italic' | 'italic bold',
}

export type FontConfig = {
    [T in RegionType]: Font
}

export interface FontManager {
    getFont(region: RegionType, mode: Mode): string;
}
