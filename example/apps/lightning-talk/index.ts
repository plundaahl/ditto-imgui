import { StyledDittoContext } from '../../../src/StyledDittoImGui';
import { background } from '../../test-widgets';
import * as layout from '../../layout';
import { intro } from './01-intro';

let curSlide = 0;
const slides = [
    intro,
];
function nextSlide() { curSlide = Math.min(curSlide + 1, slides.length - 1); }
function prevSlide() { curSlide = Math.max(curSlide - 1, 0); }

export function lightningTalkSlides(
    g: StyledDittoContext,
    canvasMetrics: { w: number, h: number },
) {
    // set defaults
    g.boxSize.defaultPadding = 10;
    g.boxSize.defaultBorder = 1;

    // make sure we have a background
    background.begin(g, 'bg', canvasMetrics.w, canvasMetrics.h);
    g.layout.addChildConstraints(
        layout.edgesWithinParent(g),
        layout.belowLastSibling(g),
        layout.fillParentHorizontally(g),
    );

    // draw current slide
    slides[curSlide](g);

    // slide controls here

    background.end(g);
}
