import { Controller } from '../../controllers/Controller';

export function createDummyController(): Controller {
    return {
        isElementHighlighted: jest.fn(() => false),
        isElementReadied: jest.fn(() => false),
        isElementTriggered: jest.fn(() => false),
        isElementToggled: jest.fn(() => false),
        isElementQueried: jest.fn(() => false),
        isElementDragged: jest.fn(() => false),
        isElementInteracted: jest.fn(() => false),
        isChildInteracted: jest.fn(() => false),
        isFloatingChildInteracted: jest.fn(() => false),
        getDragX: jest.fn(() => 0),
        getDragY: jest.fn(() => 0),
        onBeginElement: jest.fn(),
        onEndElement: jest.fn(),
        onBeginLayer: jest.fn(),
        onEndLayer: jest.fn(),
        onPreRender: jest.fn(),
        onPostRender: jest.fn(),
    };
}
