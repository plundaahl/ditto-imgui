import { DittoContext } from '../DittoImGui';
import { ThemeManager } from './ThemeManager';
import { BoxSizeAPI } from './BoxSizeService';
import { FontManager } from './FontManager';

export interface StyledDittoContext extends DittoContext {
    theme: ThemeManager;
    boxSize: BoxSizeAPI;
    font: FontManager;
}
