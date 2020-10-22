import { ActionPlugin } from '../ActionPluginManager';

export function createDummyActionPlugin(): ActionPlugin {
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
    };
}
