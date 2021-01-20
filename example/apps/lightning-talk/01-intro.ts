import { StyledDittoContext } from '../../../src/StyledDittoImGui';
import {
    heading,
    subheading,
    text,
} from '../../test-widgets';
import { sampleWindow } from './sample-window';

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
    subheading(g, 'gap', '---------');

    if (version === i++) { return; }
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
    subheading(g, next(), '---------');

    if (version === stop++) { return; }
    text(g, next(), '- A user interface library called "Ditto"');

    if (version === stop++) { return; }
    text(g, next(), '- Traditional windowed UIs, but in the browser');

    if (version === stop++) { return; }
    text(g, next(), '- Uses "immediate mode" paradigm');

    if (version === stop++) { return; }
    text(g, next(), '- Loose clone of Dear ImGui (github.com/ocornut/imgui)');

    sampleWindow(g);
}

slides.push(
    makeSlide(slide02, 0),
    makeSlide(slide02, 1),
    makeSlide(slide02, 2),
    makeSlide(slide02, 3),
    makeSlide(slide02, 4),
);

function slide03(g: StyledDittoContext, version: number) {
    let stop = 0;
    let i = 0;
    const next = () => `${i++}`;
    heading(g, next(), 'How Does It Work?');
    subheading(g, next(), '---------');

    if (version === stop++) { return; }
    text(g, next(), 'Every frame, you tell Ditto what to do:');

    if (version === stop++) { return; }
    text(g, next(), '- Clear the screen');
    text(g, next(), '- Create elements');
    text(g, next(), '- Draw everything');
}

slides.push(
    makeSlide(slide03, 0),
    makeSlide(slide03, 1),
    makeSlide(slide03, 2),
);

function slide04(g: StyledDittoContext, version: number) {
    let stop = 0;
    let i = 0;
    const next = () => `${i++}`;
    heading(g, next(), 'How Does It Work?');
    subheading(g, next(), '---------');

    text(g, next(), 'To draw an element, we run a function which:');

    if (version === stop++) { return; }
    text(g, next(), '- Tells Ditto about itself');
    text(g, next(), '- Asks some questions');
    text(g, next(), '- Generates drawing instructions');
}

slides.push(
    makeSlide(slide04, 0),
    makeSlide(slide04, 1),
);

function slide05(g: StyledDittoContext, version: number) {
    let stop = 0;
    let i = 0;
    const next = () => `${i++}`;
    heading(g, next(), 'How Does It Work?');
    subheading(g, next(), '---------');

    text(g, next(), 'To render, Ditto:');

    if (version === stop++) { return; }
    text(g, next(), '- Puts the draw instructions in a list');
    text(g, next(), '- Sorts them');
    text(g, next(), '- Gives them to the browser');

    if (version === stop++) { return; }
    text(g, next(), 'Repeat, many times a second');
}

slides.push(
    makeSlide(slide05, 0),
    makeSlide(slide05, 1),
    makeSlide(slide05, 2),
);

function slide06(g: StyledDittoContext, version: number) {
    let stop = 0;
    let i = 0;
    const next = () => `${i++}`;
    heading(g, next(), 'Immediate Mode GUIs vs. Other Paradigms');
    subheading(g, next(), '---------');

    if (version === stop++) { return; }
    text(g, next(), 'The Basics');
    text(g, next(), '- Invented (I think) by Casey Muratori, mid 2000s');
    text(g, next(), '- Used primarily in games');

    if (version === stop++) { return; }
    text(g, next(), 'CPU Cost');
    text(g, next(), '- More expensive over time');
    text(g, next(), '- More consistent costs each frame');
    text(g, next(), '- Consistency = smoother frame rate');

    if (version === stop++) { return; }
    text(g, next(), 'Not Flashy');
    text(g, next(), '- High CPU cost limits fancy graphics');
    text(g, next(), '- Bad at animations');

    if (version === stop++) { return; }
    text(g, next(), 'Fast Prototyping');
    text(g, next(), '- No cleanup code');
    text(g, next(), '- No synchronization code');
}

slides.push(
    makeSlide(slide06, 0),
    makeSlide(slide06, 1),
    makeSlide(slide06, 2),
    makeSlide(slide06, 3),
);
