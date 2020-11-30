import { ExtDittoContextImpl } from '../DittoImGui';
import { StyledDittoContext } from './StyledDittoContext';
import { ThemeManager, ThemeManagerImpl, Theme } from './ThemeManager';
import { BoxSizeManager, BoxSizeManagerImpl, BoxSizeConfig } from './BoxSizeManager';
import { FontConfig, FontManager, FontManagerImpl } from './FontManager';
import { createBasicVerticalLayoutFn } from './layouts';

export class StyledDittoContextImpl extends ExtDittoContextImpl implements StyledDittoContext {
    readonly theme: ThemeManager;
    readonly boxSize: BoxSizeManager;
    readonly font: FontManager;

    constructor(
        canvas: HTMLCanvasElement,
        defaultThemeSpec: Theme,
        boxSizing: BoxSizeConfig,
        font: FontConfig,
    ) {
        super(
            canvas,
            createBasicVerticalLayoutFn(() => this),
        );
        this.theme = new ThemeManagerImpl(defaultThemeSpec);
        this.boxSize = new BoxSizeManagerImpl(boxSizing);
        this.font = new FontManagerImpl(font);
    }
}
