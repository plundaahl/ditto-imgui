import { Layer } from './Layer';
import { Box } from './Box';
import { DrawCommand } from './DrawCommand';

export interface UiElement {
    key: string;
    parent?: UiElement;
    children: UiElement[];
    layer: Layer;
    bounds: Box;
    drawBuffer: DrawCommand[];
    flags: number;
}

