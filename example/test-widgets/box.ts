import { StyledDittoContext } from '../../src/StyledDittoImGui';
import { container } from './container';

export const box = (
    g: StyledDittoContext,
    key: string,
    color: string,
    ...constraints: {(): void}[]
) => {
    container.begin(g, key, color);
    g.layout.addConstraints(...constraints);
    container.end(g);
};
