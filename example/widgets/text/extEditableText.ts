import { StyledDittoContext } from '../../../src/StyledDittoImGui';
import { FOCUSABLE, StateComponentKey } from '../../../src/DittoImGui';
import { TextPainter } from '../TextPainter';
import { boxBevelled } from '../box';

interface EditableTextState {
    dragX: number;
    dragY: number;
    scrollX: number;
    selPos: number;
    cursorPos: number;
    arrowKeyTimer: number;
}

const stateKey: StateComponentKey<EditableTextState> = new StateComponentKey(
    'example/editableText',
    {
        dragX: -1,
        dragY: -1,
        scrollX: 0,
        selPos: -1,
        cursorPos: -1,
        arrowKeyTimer: 0,
    }
);

const textPainters: Map<StyledDittoContext, TextPainter> = new Map();

function getTextPainter(gui: StyledDittoContext): TextPainter {
    if (!textPainters.has(gui)) {
        textPainters.set(gui, new TextPainter(gui));
    }
    return textPainters.get(gui) as TextPainter;
}

export function extEditableText(
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
            .startBuilder(
                text,
                x - state.scrollX - border,
                y,
                '#000000',
            )
            .withPadding(gui.boxSize.getBorderWidth())
            .withCursor(state.cursorPos, '#FFFFFF', '#000000');

        wordWrap && builder.withWordWrap(w);
        multiline && builder.withMultiline();
        state.selPos >= 0 && builder.withSelection(
            state.selPos,
            '#FFFFFF',
            '#666666',
        );

        builder.build();
    }

    const textHeight = textPainter.getHeight() + borderX2;
    const h = height !== undefined
        ? height
        : parentBounds
            ? Math.min(
                textHeight,
                parentBounds.h - gui.bounds.getSiblingBounds().h - padding - borderX2,
            )
            : textHeight;

    boxBevelled.begin(gui, x, y, w, h, 'editable', 'idle');
    textPainter.paint();

    if (gui.focus.isElementFocused()) {
        gui.draw.setStrokeStyle('#00FF00');
    } else {
        gui.draw.setStrokeStyle('#000000');
    }

    bounds.h = h;

    handleMouseInteraction(gui, textPainter, state, text);

    if (gui.focus.isElementFocused()) {
        handleTextEntered(gui, state, valueBinding);
        handleBackspace(gui, state, valueBinding);
        handleDelete(gui, state, valueBinding);
        handleKeyboardNavigation(gui, state, text);
        handleSelectAll(gui, state, text);
    }

    updateScrolling(gui, textPainter, state);

    boxBevelled.end(gui);
    gui.draw.restore();
    gui.endElement();
}

function handleMouseInteraction(
    gui: StyledDittoContext,
    textPainter: TextPainter,
    state: EditableTextState,
    text: string,
) {
    if (gui.mouse.hoversElement()) {
        const mouseX = gui.mouse.getMouseX();
        const mouseY = gui.mouse.getMouseY();

        if (gui.mouse.isM1Down()) {
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

        if (gui.mouse.isM1DoubleClicked()) {
            const { cursorPos } = state;

            const left = text.lastIndexOf(' ', cursorPos);
            const right = text.indexOf(' ', cursorPos);

            const rightInd = right >= 0
                ? right
                : text.length;

            const leftInd = left >= 0
                ? left + 1
                : 0;

            state.selPos = leftInd;
            state.cursorPos = rightInd;
        }
    }
}

function handleTextEntered(
    gui: StyledDittoContext,
    state: EditableTextState,
    valueBinding: (t?: string) => string,
) {
    const insertedText = gui.keyboard.getBufferedText();
    if (insertedText) {
        const text = valueBinding();

        const selectionStart = Math.min(
            state.cursorPos,
            state.selPos >= 0
                ? state.selPos
                : state.cursorPos
        );
        const selectionEnd = Math.max(
            state.cursorPos,
            state.selPos >= 0
                ? state.selPos
                : state.cursorPos
        );

        valueBinding(text.substring(0, selectionStart)
            + insertedText
            + text.substring(selectionEnd));

        state.cursorPos = state.selPos = selectionStart + insertedText.length;
    }
}

function handleBackspace(
    gui: StyledDittoContext,
    state: EditableTextState,
    valueBinding: (t?: string) => string,
) {
    if (gui.keyboard.isKeyPressed('Backspace')) {
        let text = valueBinding();

        if (state.selPos < 0 || state.cursorPos === state.selPos) {
            state.cursorPos = Math.max(0, state.cursorPos - 1);
            state.selPos = -1;
            text = (
                text.substring(0, state.cursorPos)
                + text.substring(state.cursorPos + 1)
            );
        } else {
            const selectionStart = Math.min(
                state.cursorPos,
                state.selPos >= 0
                    ? state.selPos
                    : state.cursorPos
            );
            const selectionEnd = Math.max(
                state.cursorPos,
                state.selPos >= 0
                    ? state.selPos
                    : state.cursorPos
            );

            state.cursorPos = state.selPos = selectionStart;
            text = (
                text.substring(0, selectionStart)
                + text.substring(selectionEnd)
            );
        }

        valueBinding(text);
    }
}

function handleDelete(
    gui: StyledDittoContext,
    state: EditableTextState,
    valueBinding: (t?: string) => string,
) {
    if (gui.keyboard.isKeyPressed('Delete')) {
        let text = valueBinding();

        if (state.selPos < 0 || state.cursorPos === state.selPos) {
            text = (
                text.substring(0, state.cursorPos)
                + text.substring(state.cursorPos + 1)
            );
            state.cursorPos = Math.min(state.cursorPos, text.length);
            state.selPos = -1;
        } else {
            const selectionStart = Math.min(
                state.cursorPos,
                state.selPos >= 0
                    ? state.selPos
                    : state.cursorPos
            );
            const selectionEnd = Math.max(
                state.cursorPos,
                state.selPos >= 0
                    ? state.selPos
                    : state.cursorPos
            );

            state.cursorPos = state.selPos = selectionStart;
            text = (
                text.substring(0, selectionStart)
                + text.substring(selectionEnd)
            );
        }

        valueBinding(text);
    }
}

function handleKeyboardNavigation(
    gui: StyledDittoContext,
    state: EditableTextState,
    text: string,
) {
    let newCursorPos = state.cursorPos;
    let updated = false;

    if (gui.keyboard.isKeyPressed('ArrowLeft')) {
        newCursorPos = Math.max(0, state.cursorPos - 1);
        updated = true;
    }

    if (gui.keyboard.isKeyPressed('ArrowRight')) {
        newCursorPos = Math.min(text.length, state.cursorPos + 1);
        updated = true;
    }

    if (updated) {
        const isShiftDown = gui.keyboard.isKeyDown('ShiftLeft')
            || gui.keyboard.isKeyDown('ShiftRight');

        if (isShiftDown) {
            if (state.selPos === state.cursorPos || state.selPos < 0) {
                state.selPos = state.cursorPos;
            }
            state.cursorPos = newCursorPos;
        } else {
            if (state.selPos === state.cursorPos || state.selPos < 0) {
                state.cursorPos = newCursorPos;
            } else {
                if (newCursorPos < state.cursorPos) {
                    state.cursorPos = Math.min(state.cursorPos, state.selPos);
                } else {
                    state.cursorPos = Math.max(state.cursorPos, state.selPos);
                }
            }

            state.selPos = state.cursorPos;
        }
    }
}

function handleSelectAll(
    gui: StyledDittoContext,
    state: EditableTextState,
    text: string,
) {
    const isCtrlPressed = gui.keyboard.isKeyDown('ControlLeft')
        || gui.keyboard.isKeyDown('ControlRight');

    if (isCtrlPressed && gui.keyboard.isKeyPressed('KeyA')) {
        state.selPos = 0;
        state.cursorPos = text.length;
    }
}

function updateScrolling(
    gui: StyledDittoContext,
    textPainter: TextPainter,
    state: EditableTextState,
) {
    if (!gui.focus.isElementFocused()) {
        return;
    }

    const border = gui.boxSize.getBorderWidth();
    const cursorXOffset = textPainter.getXPosOfCharacter(state.cursorPos);
    const bounds = gui.bounds.getElementBounds();

    const left = bounds.x + border;
    const right = bounds.x + bounds.w;

    if (cursorXOffset < left) {
        state.scrollX -= (left - cursorXOffset);
    } else if (cursorXOffset > right) {
        state.scrollX += (cursorXOffset - right);
    }
}
