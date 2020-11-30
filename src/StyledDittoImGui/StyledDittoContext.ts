import { DittoContext } from '../DittoImGui';
import { ThemeManager } from './ThemeManager';
import { BoxSizeManager } from './BoxSizeManager';

export interface StyledDittoContext extends DittoContext {
    theme: ThemeManager;
    boxSize: BoxSizeManager;
}
