import { StyledDittoContext } from '../../src/StyledDittoImGui';
import { borderBox } from '../draw/box';
import { region } from './region';
import { button } from './button';
import { StateComponentKey } from '../../src/DittoImGui';
import * as layout from '../layout';

export const container = {
    begin: (
        gui: StyledDittoContext,
        key: string,
    ) => {
        region.begin(gui, key);
        gui.boxSize.border = 2;
    },

    end: (gui: StyledDittoContext) => {
        gui.layout.calculateLayout();
        const { x, y, w, h } = gui.bounds.getElementBounds();
        borderBox(gui, x, y, w, h, gui.boxSize.border, 'panel', 'idle');
        region.end(gui);
    },
};

const collapsableStateKey = new StateComponentKey('verticallyCollapsableContainer', {
    open: true,
});
export const verticallyCollapsableContainer = {
    begin: (
        gui: StyledDittoContext,
        key: string,
        openByDefault: boolean = true,
        ...constraints: {(): void}[]
    ) => {
        region.begin(gui, key);
        gui.layout.addConstraints(
            layout.sizeWidthByAtLeastPx(gui, 0),
            layout.sizeHeightByAtLeastPx(gui, 0),
            ...constraints
        );
        gui.layout.addChildConstraints(layout.asColDown(gui));
        gui.boxSize.border = 0;
        gui.boxSize.padding = 0;

        const state = gui.state.getStateComponent(collapsableStateKey, { open: openByDefault });

        // open/close button
        if (button(gui, key)) {
            state.open = !state.open;
        }

        // contents
        container.begin(gui, 'contents');
        if (state.open) {
            gui.layout.addConstraints(
                layout.collapseBottomToChildren(gui),
                layout.fillBelowLastSibling(gui),
            );
        } else {
            gui.layout.addConstraints(
                layout.sizeHeightByAtMostPx(gui, gui.boxSize.border * 2),
            );
        }
        gui.layout.calculateLayout();
    },

    end: (gui: StyledDittoContext) => {
        container.end(gui);
        region.end(gui);
    },
};
