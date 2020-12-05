import { StyledDittoContext, Mode } from '../../../src/StyledDittoImGui';
import { FOCUSABLE } from '../../../src/DittoImGui';
import { boxBevelled } from '../box';

function begin(
    gui: StyledDittoContext,
    title: string,
    valueBinding: (v?: number) => number,
    min: number,
    max: number,
    constraintFn?: (v: number) => number,
) {
    gui.beginElement('slider', FOCUSABLE);

    const isFocused = gui.focus.isElementFocused();
    const isInteracted = gui.controller.isElementInteracted();

    const padding = gui.boxSize.getPadding();
    const border = gui.boxSize.getBorderWidth();
    const borderX2 = border * 2;
    const bordAndPad = border + padding;

    const bounds = gui.bounds.getElementBounds();
    bounds.h = gui.draw.measureText(title).ascent + ((bordAndPad) * 2);
    const { x, y, w, h } = bounds;

    const value = valueBinding();
    const percent = (value - min) / (max - min);
    const sliderPos = percent * w;

    let mode: Mode = 'idle';
    if (isInteracted) {
        mode = 'active';
    } else if (isFocused) {
        mode = 'focused';
    }

    // draw box
    boxBevelled.begin(gui, x, y, w, h, 'editable', mode);

    // draw slider
    gui.draw.setFillStyle(isFocused
        ? gui.theme.getColor('titlebar', 'focused', 'bg')
        : gui.theme.getColor('titlebar', 'idle', 'bg')
    );
    gui.draw.fillRect(x, y, sliderPos, h);

    // draw value text
    gui.draw.setFillStyle(gui.theme.getColor('editable', 'idle', 'detail'));
    gui.draw.setFont(gui.font.getFont('editable', mode));
    gui.draw.drawText(value.toString(), x + bordAndPad, y + bordAndPad);

    // update based on mouse
    let delta = 0;
    if (gui.mouse.hoversElement() && gui.mouse.isM1Down()) {
        delta = gui.mouse.getMouseX() - x - sliderPos;
    } else if (gui.controller.isElementDragged()) {
        delta = gui.controller.getDragX();
    }

    if (delta) {
        const newPos = Math.max(0, Math.min(w, sliderPos + delta));
        const newPercent = newPos / w;
        const newValue = (newPercent * (max - min)) + min;
        valueBinding(
            constraintFn
                ? constraintFn(newValue)
                : newValue 
        );
    }

    if (isInteracted) {
        gui.focus.focusElement();
    }
}

function end(
    gui: StyledDittoContext,
) {
    boxBevelled.end(gui);
    gui.draw.restore();
    gui.endElement();
}

export const extSlider = { begin, end };
