import { StyledDittoContext, Mode } from '../../src/StyledDittoImGui';
import { FOCUSABLE } from '../../src/DittoImGui';
import { bevelBox } from './bevelBox';

const TWO_THIRDS = 2 / 3;
const ONE_THIRD = 1 - TWO_THIRDS;

export function slider(
    gui: StyledDittoContext,
    title: string,
    valueBinding: (v?: number) => number,
    min: number,
    max: number,
) {
    gui.beginElement(title, FOCUSABLE);
    gui.draw.save();

    const isFocused = gui.focus.isElementFocused() || gui.focus.isChildFocused();

    let mode: Mode = 'idle';
    if (gui.controller.isElementInteracted()) {
        mode = 'active';
    } else if (isFocused) {
        mode = 'focused';
    }

    gui.draw.setFont(gui.font.getFont('editable', mode));

    const textMetrics = gui.draw.measureText(title);
    const border = gui.boxSize.getBorderWidth();
    const borderX2 = border * 2;
    const padding = gui.boxSize.getPadding();
    const bounds = gui.bounds.getElementBounds();

    bounds.h = bounds.h || ((border * 2) + (padding * 2) + textMetrics.height);
    bounds.w = bounds.w || 200;

    const { x, y, w, h } = bounds;
    const value = valueBinding();

    // box
    bevelBox(gui, x, y, w * TWO_THIRDS, h, 'editable', mode);

    // slider
    {
        gui.beginElement('slider');
        const bounds = gui.bounds.getElementBounds();
        bounds.x = x + border;
        bounds.y = y + border;
        bounds.w = (w * TWO_THIRDS) - borderX2;
        bounds.h = h - borderX2;

        const { x: sliderX, y: sliderY, w: sliderW, h: sliderH } = bounds;

        const percent = (value - min) / (max - min);
        const sliderPos = percent * sliderW;

        gui.draw.setFillStyle(isFocused
            ? gui.theme.getColor('titlebar', 'focused', 'bg')
            : gui.theme.getColor('titlebar', 'idle', 'bg')
        );
        gui.draw.fillRect(
            sliderX,
            sliderY,
            sliderPos,
            sliderH,
        );

        let delta = 0;
        if (gui.mouse.hoversElement() && gui.mouse.isM1Down()) {
            delta = gui.mouse.getMouseX() - sliderX - sliderPos;
        } else if (gui.controller.isElementDragged()) {
            delta = gui.controller.getDragX();
        }

        if (delta) {
            const newPos = Math.max(0, Math.min(sliderW, sliderPos + delta));
            const newPercent = newPos / sliderW;
            valueBinding((newPercent * (max - min)) + min);
        }

        gui.endElement();
    }

    // label
    gui.draw.setFillStyle(gui.theme.getColor(
        'panel',
        isFocused ? 'focused' : 'idle',
        'detail',
    ));
    gui.draw.drawText(
        title,
        x + (w * TWO_THIRDS) + padding,
        y + ((h - textMetrics.height) * 0.5),
    );

    if (gui.controller.isElementInteracted() || gui.controller.isChildInteracted()) {
        gui.focus.focusElement();
    }

    gui.draw.restore();
    gui.endElement();
}
