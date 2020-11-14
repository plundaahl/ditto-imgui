import { Layer } from '../../types';

export interface RenderService {
    render(layers: readonly Layer[]): void;
}

