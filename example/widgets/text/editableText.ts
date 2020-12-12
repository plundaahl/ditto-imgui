import { StyledDittoContext } from '../../../src/StyledDittoImGui';
import { StateComponentKey } from '../../../src/DittoImGui';
import { control } from '../macro';
import { extEditableText } from './extEditableText';

interface EditableTextState {
    isInDraftState: boolean,
    draftText: string, 
}

const stateKey = new StateComponentKey<EditableTextState>('editableText', {
    isInDraftState: false,
    draftText: '',
});

const defaultState: EditableTextState = {
    draftText: '',
    isInDraftState: false,
};

let curState: EditableTextState = defaultState;
const draftValueBinding = (input = curState.draftText) => curState.draftText = input;

export function editableText(
    gui: StyledDittoContext,
    key: string,
    valueBinding: (t?: string) => string,
) {
    control.begin(gui, key);

    const state = gui.state.getStateComponent(stateKey);
    curState = state;
    if (!state.isInDraftState) {
        state.draftText = valueBinding();
    }

    extEditableText.begin(
        gui,
        'editableText',
        draftValueBinding,
        false,
        false,
    );
    if (gui.focus.isElementFocused()) {
        if (draftValueBinding() !== valueBinding()) {
            state.isInDraftState = true;
        }
        if (gui.keyboard.isKeyPressed('Enter')) {
            state.isInDraftState = false;
            valueBinding(state.draftText);
        }
        if (gui.keyboard.isKeyPressed('Escape')) {
            state.isInDraftState = false;
        }
    } else {
        if (draftValueBinding() !== valueBinding()) {
            state.isInDraftState = false;
            valueBinding(state.draftText);
        }
    }

    extEditableText.end(gui);

    curState = defaultState;
    control.end(gui);
}

