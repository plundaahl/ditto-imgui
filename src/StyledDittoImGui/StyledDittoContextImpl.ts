import { ExtDittoContextImpl } from '../DittoImGui';
import { StyledDittoContext } from './StyledDittoContext';
import { ThemeManager, ThemeManagerImpl, Theme } from './ThemeManager';
import { BoxSizeService, BoxSizeAPI, BoxSizeServiceImpl } from './BoxSizeService';
import { FontConfig, FontManager, FontManagerImpl } from './FontManager';

export class StyledDittoContextImpl extends ExtDittoContextImpl implements StyledDittoContext {
    private readonly boxSizeService: BoxSizeService;

    constructor(
        canvas: HTMLCanvasElement,
        defaultThemeSpec: Theme,
        font: FontConfig,
    ) {
        super(canvas);
        this.theme = new ThemeManagerImpl(defaultThemeSpec);
        this.boxSizeService = new BoxSizeServiceImpl();
        this.font = new FontManagerImpl(font);
    }

    readonly theme: ThemeManager;
    readonly font: FontManager;
    get boxSize(): BoxSizeAPI { return this.boxSizeService };

    beginLayer(key: string, flags?: number) {
        super.beginLayer(key, flags);
        this.boxSizeService.onBeginLayer();
    }

    endLayer() {
        super.endLayer();
        this.boxSizeService.onEndLayer();
    }

    beginElement(key: string, flags?: number) {
        super.beginElement(key, flags);
        this.boxSizeService.onBeginElement();
    }

    endElement() {
        super.endElement();
        this.boxSizeService.onEndElement();
    }

    render() {
        super.render();
        this.boxSizeService.onPostRender();
    }
}
