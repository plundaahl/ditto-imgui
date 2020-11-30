import { ExtDittoContextImpl } from '../DittoImGui';
import { StyledDittoContext } from './StyledDittoContext';
import { ThemeManager, ThemeManagerImpl, Theme } from './ThemeManager';
import { BoxSizeManager, BoxSizeManagerImpl, BoxSizeConfig } from './BoxSizeManager';
import { createBasicVerticalLayoutFn } from './layouts';

export class StyledDittoContextImpl extends ExtDittoContextImpl implements StyledDittoContext {
    readonly theme: ThemeManager;
    readonly boxSize: BoxSizeManager;

    constructor(
        canvas: HTMLCanvasElement,
        defaultThemeSpec: Theme,
        boxSizing: BoxSizeConfig,
    ) {
        super(
            canvas,
            createBasicVerticalLayoutFn(() => this),
        );
        this.theme = new ThemeManagerImpl(defaultThemeSpec);
        this.boxSize = new BoxSizeManagerImpl(boxSizing);
    }
}
