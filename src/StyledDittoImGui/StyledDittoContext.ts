import { DittoContext } from '../DittoImGui';
import { ThemeManager } from './ThemeManager';

export interface StyledDittoContext extends DittoContext {
    theme: ThemeManager;
}
