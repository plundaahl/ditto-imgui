import { StyledDittoContext } from '../../src/StyledDittoImGui';
import { region } from './region';
import { textLabel } from './textlabel';
import * as layout from '../layout';

const PADDING = 2;
const fontStyle = '16px monospace';
const defaultDragBinding: { (x: number): number } = () => 0;

const storageStack: {
    title: string,
    dragXBinding: { (x: number): number },
    dragYBinding: { (x: number): number },
}[] = [];

export const titleBar = {
    begin: (
        gui: StyledDittoContext,
        title: string,
        dragXBinding: { (x: number): number } = defaultDragBinding,
        dragYBinding: { (x: number): number } = defaultDragBinding,
    ) => {
        storageStack.push({ title, dragXBinding, dragYBinding });

        region.begin(gui, title);
        gui.layout.addConstraints(
            layout.fillParentHorizontally(gui),
            layout.offsetPosFromSiblingBottom(gui),
            layout.sizeHeightByPx(gui, 30),
        );
        gui.layout.addChildConstraints(
            layout.fillParentVertically(gui),
            layout.asRowLeft(gui),
        );
        gui.layout.calculateLayout();

        gui.boxSize.padding = 2;
    },

    end: (gui: StyledDittoContext) => {
        // Fetch Details
        const storageBox = storageStack.pop();
        if (storageBox === undefined) { throw new Error('should not happen'); }
        const { title, dragXBinding, dragYBinding } = storageBox;
        const { x, y, w, h } = gui.bounds.getElementBounds();

        // Begin Title Region
        region.begin(gui, 'draggable-region');
        gui.layout.addConstraints(layout.fillLeftOfLastSibling(gui));
        gui.layout.addChildConstraints(
            layout.offsetPosFromParentLeft(gui),
            layout.offsetPosFromParentTop(gui),
            layout.fillParentVertically(gui),
            layout.fillParentHorizontally(gui),
        );
        gui.layout.calculateLayout();

        gui.boxSize.border = 0;
        gui.boxSize.padding = PADDING;

        // Title
        gui.draw.setFont(fontStyle);
        textLabel(gui, 'title', title, 0, '#FFFFFF');

        const hoversDragRegion = gui.mouse.hoversElement() || gui.mouse.hoversChild();
        region.end(gui);
        // End Title Region

        // Background + Hovering
        if (hoversDragRegion || gui.mouse.hoversElement()) {
            gui.draw.setFillStyle('#00CC00');
            gui.draw.fillRect(x, y, w, h);

            if (gui.mouse.isM1Down()) {
                dragXBinding(gui.mouse.getDragX());
                dragYBinding(gui.mouse.getDragY());
            }
        } else {
            gui.draw.setFillStyle('#5555FF');
            gui.draw.fillRect(x, y, w, h);
        }

        region.end(gui);
    },
}
