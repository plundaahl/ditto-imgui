import { StyledDittoContext } from '../../src/StyledDittoImGui';
import { FOCUSABLE, StateComponentKey } from '../../src/DittoImGui';
import { TextPainter } from './TextPainter';
import { bevelBox } from './bevelBox';

const stateKey = new StateComponentKey('example/editableText', {
    dragX: -1,
    dragY: -1,
    selPos: -1,
    cursorPos: -1,
    arrowKeyTimer: 0,
});

const textPainters: Map<StyledDittoContext, TextPainter> = new Map();
function getTextPainter(gui: StyledDittoContext): TextPainter {
    if (!textPainters.has(gui)) {
        textPainters.set(gui, new TextPainter(gui));
    }
    return textPainters.get(gui) as TextPainter;
}


export function editableText(
    gui: StyledDittoContext,
    key: string,
    valueBinding: (t?: string) => string,
    multiline: boolean = false,
    wordWrap: boolean = false,
    height?: number,
) {
    const textPainter = getTextPainter(gui);
    gui.beginElement(key, FOCUSABLE);
    gui.draw.save();

    const state = gui.state.getStateComponent(stateKey);
    const bounds = gui.bounds.getElementBounds();
    const parentBounds = gui.bounds.getParentBounds();

    const border = gui.boxSize.getBorderWidth();
    const borderX2 = border * 2;
    const padding = gui.boxSize.getPadding();

    const y = bounds.y;
    const x = bounds.x;
    const w = bounds.w;

    let text = valueBinding();

    gui.draw.setFont(gui.font.getFont('editable', 'idle'));
    gui.draw.setFillStyle('#000000');

    {
        const builder = textPainter
            .startBuilder(text, x, y, '#000000')
            .withPadding(gui.boxSize.getBorderWidth())
            .withCursor(state.cursorPos, '#FFFFFF', '#000000');

        wordWrap && builder.withWordWrap(w);
        multiline && builder.withMultiline();
        state.selPos >= 0 && builder.withSelection(state.selPos, '#FFFFFF', '#666666');

        builder.build();
    }

    const textHeight = textPainter.getHeight() + (gui.boxSize.getBorderWidth() * 2);
    const h = height !== undefined
        ? height
        : parentBounds
            ? Math.min(
                textHeight,
                parentBounds.h - gui.bounds.getSiblingBounds().h - padding - borderX2,
            )
            : textHeight;

    bevelBox(gui, x, y, w, h, 'editable', 'idle');
    gui.draw.beginPath();
    gui.draw.rect(
        x + border,
        y + border,
        w + borderX2,
        h + borderX2,
    );
    gui.draw.clip();
    textPainter.paint();

    if (gui.focus.isElementFocused()) {
        gui.draw.setStrokeStyle('#00FF00');
    } else {
        gui.draw.setStrokeStyle('#000000');
    }

    bounds.h = h;

    if (gui.mouse.hoversElement() && gui.mouse.isM1Down()) {
        const mouseX = gui.mouse.getMouseX();
        const mouseY = gui.mouse.getMouseY();
        state.cursorPos = textPainter.getCharIndexAtPoint(mouseX, mouseY);
        gui.focus.focusElement();

        if (gui.mouse.isM1Dragged()) {
            state.selPos = textPainter.getCharIndexAtPoint(
                state.dragX,
                state.dragY,
            );
        } else {
            state.selPos = -1;
            state.dragX = mouseX;
            state.dragY = mouseY;
        }
    }

    if (gui.focus.isElementFocused()) {
        const insertedText = gui.keyboard.getBufferedText();
        if (insertedText) {
            const selectionStart = Math.min(state.cursorPos, state.selPos >= 0 ? state.selPos : state.cursorPos);
            const selectionEnd = Math.max(state.cursorPos, state.selPos >= 0 ? state.selPos : state.cursorPos);

            text = text.substring(0, selectionStart)
                + insertedText
                + text.substring(selectionEnd);

            state.cursorPos = state.selPos = selectionStart + insertedText.length;
            valueBinding(text);
        }

        if (gui.keyboard.isKeyPressed('Backspace')) {
            if (state.selPos < 0 || state.cursorPos === state.selPos) {
                text = text.substring(0, state.cursorPos - 1) + text.substring(state.cursorPos);
                valueBinding(text);
                state.cursorPos--;
                state.selPos--;
            } else {
                const selectionStart = Math.min(state.cursorPos, state.selPos >= 0 ? state.selPos : state.cursorPos);
                const selectionEnd = Math.max(state.cursorPos, state.selPos >= 0 ? state.selPos : state.cursorPos);

                text = text.substring(0, selectionStart)
                    + text.substring(selectionEnd);

                state.cursorPos = state.selPos = selectionStart;
                valueBinding(text);
            }
        }

        if (gui.keyboard.isKeyPressed('ArrowLeft')) {
            state.cursorPos = Math.max(0, state.cursorPos - 1);
            state.selPos = state.cursorPos;
        }

        if (gui.keyboard.isKeyPressed('ArrowRight')) {
            state.cursorPos = Math.min(text.length, state.cursorPos + 1);
            state.selPos = state.cursorPos;
        }
    }

    gui.draw.restore();
    gui.endElement();
}
