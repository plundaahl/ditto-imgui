import { DittoContext } from '../DittoImGui';
import { ThemeManager } from './ThemeManager';
import { BoxSizeManager } from './BoxSizeManager';
import { FontManager } from './FontManager';

export interface StyledDittoContext extends DittoContext {
    theme: ThemeManager;
    boxSize: BoxSizeManager;
    font: FontManager;
}
