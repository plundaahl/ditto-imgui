import { StyledDittoContext } from '../../../src/StyledDittoImGui';
import { StateComponentKey } from '../../../src/DittoImGui';
import { control } from '../macro';
import { extEditableText } from './extEditableText';

interface EditableTextState {
    isInDraftState: boolean,
    draftValue: string, 
}

const stateKey = new StateComponentKey<EditableTextState>('editableNumber', {
    isInDraftState: false,
    draftValue: '',
});

const defaultState: EditableTextState = {
    draftValue: '',
    isInDraftState: false,
};

let curState: EditableTextState = defaultState;
const draftValueBinding = (input = curState.draftValue) => curState.draftValue = input;

function parseInput(input: string, ifError: number, constraint?: (n: number) => number): number {
    const result = Number.parseFloat(input);
    if (typeof result !== 'number') {
        return ifError;
    }

    if (constraint) {
        return constraint(result);
    }

    return result;
}

export function editableNumber(
    gui: StyledDittoContext,
    key: string,
    valueBinding: (t?: number) => number,
    constraintFn?: ((input: number) => number),
) {
    control.begin(gui, key);

    const state = gui.state.getStateComponent(stateKey);
    curState = state;
    if (!state.isInDraftState) {
        state.draftValue = valueBinding().toString();
    }

    extEditableText.begin(
        gui,
        'editableNumber',
        draftValueBinding,
        false,
        false,
    );
    if (gui.focus.isElementFocused()) {
        if (draftValueBinding() !== valueBinding().toString()) {
            state.isInDraftState = true;
        }
        if (gui.keyboard.isKeyPressed('Enter')) {
            state.isInDraftState = false;
            valueBinding(parseInput(state.draftValue, valueBinding(), constraintFn));
        }
        if (gui.keyboard.isKeyPressed('Escape')) {
            state.isInDraftState = false;
        }
    } else {
        if (draftValueBinding() !== valueBinding().toString()) {
            state.isInDraftState = false;
            valueBinding(parseInput(state.draftValue, valueBinding(), constraintFn));
        }
    }

    extEditableText.end(gui);

    curState = defaultState;
    control.end(gui);
}

