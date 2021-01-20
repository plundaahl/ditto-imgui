import { StyledDittoContext } from '../../../src/StyledDittoImGui';
import { background, button, container } from '../../test-widgets';
import * as layout from '../../layout';
import { slides } from './01-intro';

let curSlide = 0;
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
    
    container.begin(g, 'contents', 'white',
        layout.edgesWithinParent(g),
        layout.fillParentHorizontally(g),
        layout.fillParentVertically(g),
    );
    {
        g.layout.addChildConstraints(
            layout.edgesWithinParent(g),
            layout.alignBelowLastSibling(g),
            layout.fillParentHorizontally(g),
        );

        // draw current slide
        slides[curSlide](g);
    }
    container.end(g);

    // slide controls here
    container.begin(g, 'contents', 'white',
        layout.alignRightFractionOfParent(g),
        layout.alignBottomFractionOfParent(g),
        layout.widthExactly(g, 200),
        layout.heightFillsParent(g),
    );
    {
        g.layout.addChildConstraints(
            layout.fillParentHorizontally(g),
            layout.alignAboveLastSibling(g),
        );

        if (button(g, 'prev')) {
            prevSlide();
        }

        if (button(g, 'next')) {
            nextSlide();
        }
    }
    container.end(g);

    background.end(g);
}
