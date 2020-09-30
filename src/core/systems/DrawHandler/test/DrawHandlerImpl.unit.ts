import { DrawCommand, UiElement } from '../../../types';
import { DrawHandlerImpl } from '../DrawHandlerImpl';
import { createFakeCanvasContext } from '../../../test/createFakeCanvasContext';

class InspectableDrawHandlerImpl extends DrawHandlerImpl {
    pushDrawCommand(command: DrawCommand) {
        super.pushDrawCommand(command);
    }
}

let instance: InspectableDrawHandlerImpl;

beforeEach(() => {
    instance = new InspectableDrawHandlerImpl(createFakeCanvasContext);
});

describe('pushDrawCommand', () => {
    const command: DrawCommand = {
        native: true,
        command: 'clearRect',
        args: [0, 0, 50, 50],
    };

    describe('when there is no current element', () => {
        test('should error', () => {
            expect(() => instance.pushDrawCommand(command)).toThrow();
        });
    });

    describe('when there is a current element', () => {
        let element: UiElement;
        beforeEach(() => {
            element = {
                key: 'foo',
                bounds: { x: 0, y: 0, w: 100, h: 100 },
                layer: {
                    key: 'foo',
                    zIndex: -1,
                    rootElement: element,
                },
                children: [],
                drawBuffer: [],
            };
            instance.setCurrentElement(element);
        });

        test('should not error', () => {
            expect(() => instance.pushDrawCommand(command)).not.toThrow();
        });

        test("should push command onto element's drawBuffer", () => {
            instance.pushDrawCommand(command);
            expect(element.drawBuffer[0]).toBe(command);
        });
    });
});
