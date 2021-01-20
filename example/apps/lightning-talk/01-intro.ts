import { StyledDittoContext } from '../../../src/StyledDittoImGui';
import {
    heading,
    subheading,
    text,
} from '../../test-widgets';

export const slides: { (g: StyledDittoContext): void }[] = [];
function makeSlide(
    fn: { (g: StyledDittoContext, version: number): void },
    version: number,
) {
    return (g: StyledDittoContext) => fn(g, version);
}

function slide01(g: StyledDittoContext, version: number) {
    let i = 0;

    heading(g, 'intro1', 'Side Project Showcase:');
    subheading(g, 'intro2', 'Building a UI Framework from Scratch');

    if (version === i++) { return; }

    subheading(g, 'gap', '---------');
    subheading(g, 'agenda', 'Agenda');

    text(g, 'item1', '- What is this thing?');
    text(g, 'item2', '- How does it work?');
    text(g, 'item3', '- Comparison');
}

slides.push(
    makeSlide(slide01, 0),
    makeSlide(slide01, 1),
);

function slide02(g: StyledDittoContext, version: number) {
    let stop = 0;
    let i = 0;
    const next = () => `${i++}`;
    heading(g, next(), 'What Is This Thing?');

    if (version === stop++) { return; }
    subheading(g, next(), '---------');
    text(g, next(), '- A user interface library called "Ditto"');

    if (version === stop++) { return; }
    text(g, next(), '- Traditional windowed UIs, but in the browser');

    if (version === stop++) { return; }
    text(g, next(), '- Uses "immediate mode" paradigm');

    if (version === stop++) { return; }
    text(g, next(), '- Loose clone of Dear ImGui (github.com/ocornut/imgui)');
}

slides.push(
    makeSlide(slide02, 0),
    makeSlide(slide02, 1),
    makeSlide(slide02, 2),
    makeSlide(slide02, 3),
    makeSlide(slide02, 4),
);
