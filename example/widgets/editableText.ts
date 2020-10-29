import { getContext, DittoContext } from '../../src/core';
import { StateHandle } from '../../src/core/ServiceManager/services/StateService';

const FONT = '';
const LINEHEIGHT_SCALE = 1.2;
const PADDING = 2;
const CURSOR_OFFSET = -0.3;
const BLINK_TIME = 45; // Todo: this should not be frame-dependent

interface EditTextState {
    blinkTimer: number;
    cursorPos: number;
}

const defaultEditTextState: EditTextState = {
    blinkTimer: 0,
    cursorPos: 0,
};

let gui: DittoContext;
let stateHandle: StateHandle<EditTextState>;

function init() {
    if (gui || stateHandle) {
        return;
    }
    gui = getContext();
    stateHandle = gui.state.createHandle<EditTextState>('editText');
}

export function editableText(
    key: string,
    valueBinding: (t?: string) => string,
    wordWrap: boolean = false,
) {
    init();
    let text = valueBinding();

    gui.beginElement(key);
    const state = stateHandle.declareAndGetState(defaultEditTextState);

    state.blinkTimer += 1;
    if (state.blinkTimer > BLINK_TIME) {
        state.blinkTimer -= (BLINK_TIME + BLINK_TIME);
    }
    const shouldDrawCursor = state.blinkTimer >= 0;

    gui.draw.setFont(FONT);
    gui.draw.setFillStyle('#000000');

    const { x: boundsX, y, w: boundsW } = gui.element.bounds;
    const {
        width: charW,
        height: charH,
    } = gui.draw.measureText('M');
    const x = boundsX + PADDING;
    const w = boundsW - (PADDING + PADDING);
    const lineHeight = charH * LINEHEIGHT_SCALE;

    if (!wordWrap) {
        gui.element.bounds.h += charH;
        gui.draw.drawText(text.replace('\n',' '), x, y);

        if (shouldDrawCursor) {
            gui.draw.drawText('|', x + (state.cursorPos * charW), y);
        }
    } else {
        const maxCharsPerLine = Math.floor(w / charW);
        const textLen = text.length;

        let from: number = 0;
        let line: string;
        let lineNo: number = 0;
        let cursorW: number = state.cursorPos;

        while (from < textLen) {
            line = text.substr(from, maxCharsPerLine);

            let newlinePos = line.indexOf('\n');
            if (newlinePos >= 0) {
                line = line.substr(0, newlinePos);
            }

            gui.element.bounds.h += charH;
            gui.draw.drawText(line, x, y + (lineHeight * lineNo));

            if (shouldDrawCursor && 0 <= cursorW && cursorW < line.length) {
                 gui.draw.drawText('|', x + ((cursorW + CURSOR_OFFSET) * charW), y + (lineHeight * lineNo));
            }

            cursorW -= line.length;
            from += line.length;
            lineNo++;
        }
    }

    gui.endElement();
}
