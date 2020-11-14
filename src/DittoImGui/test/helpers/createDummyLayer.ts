import { Layer } from '../../types';

export function createDummyLayer(overrides: Partial<Layer> = {}): Layer {
    return {
        key: 'foo',
        zIndex: 0,
        ...overrides,
    };
}
