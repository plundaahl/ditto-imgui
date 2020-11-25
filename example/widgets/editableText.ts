import { getContext, DittoContext, FOCUSABLE } from '../../src/DittoImGui';
import { StateHandle } from '../../src/DittoImGui/services/StateService';
import { TextPainter } from './TextPainter';

const FONT = '12px monospace';
const PADDING = 2;

interface EditTextState {
    dragX: number;
    dragY: number;
    selPos: number;
    cursorPos: number;
    arrowKeyTimer: number;
}

const defaultEditTextState: EditTextState = {
    dragX: -1,
    dragY: -1,
    selPos: -1,
    cursorPos: -1,
    arrowKeyTimer: 0,
};

let gui: DittoContext;
let stateHandle: StateHandle<EditTextState>;
let textPainter: TextPainter;

function init() {
    if (gui || stateHandle) {
        return;
    }
    gui = getContext();
    stateHandle = gui.state.createHandle<EditTextState>('editText');
    textPainter = new TextPainter(gui);
}

export function editableText(
    key: string,
    valueBinding: (t?: string) => string,
    multiline: boolean = false,
    wordWrap: boolean = false,
) {
    init();
    gui.beginElement(key, FOCUSABLE);

    const state = stateHandle.declareAndGetState(defaultEditTextState);
    const bounds = gui.bounds.getElementBounds();

    const y = bounds.y;
    const x = bounds.x + PADDING;
    const w = bounds.w - (PADDING + PADDING);
    let text = valueBinding();

    gui.draw.setFont(FONT);
    gui.draw.setFillStyle('#000000');

    {
        const builder = textPainter
            .startBuilder(text, x, y, '#000000')
            .withCursor(state.cursorPos, '#FFFFFF', '#000000');

        wordWrap && builder.withWordWrap(w);
        multiline && builder.withMultiline();
        state.selPos >= 0 && builder.withSelection(state.selPos, '#FFFFFF', '#666666');

        builder.build();
    }

    textPainter.paint();

    if (gui.focus.isElementFocused()) {
        gui.draw.setStrokeStyle('#00FF00');
    } else {
        gui.draw.setStrokeStyle('#000000');
    }
    gui.draw.strokeRect(x, y, w, textPainter.getHeight());

    bounds.h = textPainter.getHeight();

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

    gui.endElement();
}
