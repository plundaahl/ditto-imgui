import { getContext, DittoContext } from '../../src/core';
import { StateHandle } from '../../src/core/ServiceManager/services/StateService';
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
    gui.beginElement(key);

    const state = stateHandle.declareAndGetState(defaultEditTextState);

    const y = gui.element.bounds.y;
    const x = gui.element.bounds.x + PADDING;
    const w = gui.element.bounds.w - (PADDING + PADDING);
    let text = valueBinding();

    gui.draw.setFont(FONT);
    gui.draw.setFillStyle('#000000');

    const builder = textPainter
        .startBuilder(text, x, y, '#000000')
        .withCursor(state.cursorPos, '#FFFFFF', '#000000');

    wordWrap && builder.withWordWrap(w);
    multiline && builder.withMultiline();
    state.selPos >= 0 && builder.withSelection(state.selPos, '#FFFFFF', '#666666');

    builder.build();

    textPainter.paint();

    gui.draw.setStrokeStyle('#000000');
    gui.draw.strokeRect(x, y, w, textPainter.getHeight());

    gui.element.bounds.h = textPainter.getHeight();

    if (gui.mouse.hoversElement() && gui.mouse.isM1Down()) {
        const { mouseX, mouseY } = gui.mouse;
        state.cursorPos = textPainter.getCharIndexAtPoint(mouseX, mouseY);

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

    gui.endElement();
}
