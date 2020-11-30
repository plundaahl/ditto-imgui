import { font } from './font';
import { boxSize } from './boxSize';
import { theme } from './theme';

(window as any).boxSize = boxSize;
(window as any).theme = theme;
(window as any).font = font;

export {
    font,
    boxSize,
    theme,
};
