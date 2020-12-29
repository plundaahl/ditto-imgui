import { font } from './font';
import { theme } from './theme';

(window as any).theme = theme;
(window as any).font = font;

export {
    font,
    theme,
};
