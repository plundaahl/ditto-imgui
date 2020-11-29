import { ExtDittoContextImpl } from '../DittoImGui';
import { StyledDittoContext } from './StyledDittoContext';
import { ThemeManager, ThemeManagerImpl, Theme } from './ThemeManager';

export class StyledDittoContextImpl extends ExtDittoContextImpl implements StyledDittoContext {
    readonly theme: ThemeManager;

    constructor(
        canvas: HTMLCanvasElement,
        defaultThemeSpec: Theme,
    ) {
        super(canvas);
        this.theme = new ThemeManagerImpl(defaultThemeSpec);
    }
}
