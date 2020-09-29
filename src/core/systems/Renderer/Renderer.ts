import { Layer } from '../../types';

export interface Renderer {
    render(layers: readonly Layer[]): void;
}

