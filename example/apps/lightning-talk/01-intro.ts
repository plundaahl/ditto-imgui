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
    let stop = 0;
    let i = 0;
    const next = () => `${i++}`;

    heading(g, 'intro1', 'Side Project Showcase:');
    subheading(g, 'intro2', 'Building a UI Framework from Scratch');
    subheading(g, 'gap', '---------');

    if (version === stop++) { return; }
    sampleWindow(g);

    text(g, next(), '- Windowed UIs in HTML Canvas');
    text(g, next(), '- Uses "immediate mode" paradigm');
    text(g, next(), '- Called "Ditto"');
    text(g, next(), '- Loose based on Dear ImGui (github.com/ocornut/imgui)');
}

slides.push(
    makeSlide(slide01, 0),
    makeSlide(slide01, 1),
);

const timelineSlides = [
`
Core Architecture  |========
Experiments        |     =======================
Features           |              ===========
Refactoring        |            ====    ======
Widgets            |                       =========
Layouts Rewrite    |                               ===========
-------------------+------------------------------------------
                   |Sep     Oct     Nov     Dec     Jan`,
`
Core Architecture  |[======]
Experiments        |     =======================
Features           |              ===========
Refactoring        |            ====    ======
Widgets            |                       =========
Layouts Rewrite    |                               ===========
-------------------+------------------------------------------
                   |Sep     Oct     Nov     Dec     Jan
\\\\
September:
    - Validate core architecture
    - Done by iterating`,
`
Core Architecture  |========
Experiments        |     [=======]==============
Features           |              ===========
Refactoring        |            []==    ======
Widgets            |                       =========
Layouts Rewrite    |                               ===========
-------------------+------------------------------------------
                   |Sep     Oct     Nov     Dec     Jan
\\\\
October:
    - Figuring out key features
    - Lots of iterating and experimentation
    - Slower because I was spread out`,
`
Core Architecture  |========
Experiments        |     =========[========]====
Features           |              [========]=
Refactoring        |            ==[=    ===]==
Widgets            |                       =========
Layouts Rewrite    |                               ===========
-------------------+------------------------------------------
                   |Sep     Oct     Nov     Dec     Jan
\\\\
November:
    - Still experimenting
    - Finally getting services done
    - Bogged down by refactoring`,
`
Core Architecture  |========
Experiments        |     ==================[===]
Features           |              =========[]
Refactoring        |            ====    ===[=]
Widgets            |                       [=======]
Layouts Rewrite    |                               ===========
-------------------+------------------------------------------
                   |Sep     Oct     Nov     Dec     Jan
\\\\
December:
    - Creating widget library`,
`
Core Architecture  |========
Experiments        |     =======================
Features           |              ===========
Refactoring        |            ====    ======
Widgets            |                       =========
Layouts Rewrite    |                               [=========]
-------------------+------------------------------------------
                   |Sep     Oct     Nov     Dec     Jan
\\\\
January:
    - Throwing out widgets
    - Rewriting layout code`,
];

function slideTimeline(g: StyledDittoContext, version: number) {
    let i = 0;
    const next = () => `${i++}`;

    heading(g, next(), 'The Journey');
    subheading(g, next(), '---------');

    text(g, next(), timelineSlides[version])
}

slides.push(
    makeSlide(slideTimeline, 0),
    makeSlide(slideTimeline, 1),
);

function slideCoreArch(g: StyledDittoContext) {
    let i = 0;
    const next = () => `${i++}`;

    heading(g, next(), 'Architecture');
    subheading(g, next(), '---------');
    text(g, next(), `
Core:
    - Build + manage UI elements
    - Layering
    - Rendering
Services:
    - Mouse
    - Keyboard
    - Focus
    - State Management
    - Layouts
    - Themes
    - Draw Command Buffering
`);
}

function slideCoreArch02(g: StyledDittoContext) {
    let i = 0;
    const next = () => `${i++}`;

    heading(g, next(), 'Architecture');
    subheading(g, next(), '---------');
    text(g, next(), `
Downsides:
    - Some duplication/wasted CPU cycles
Benefits:
    - Easily rewrite major features
Requirements:
    - Solid core architecture`);
}

slides.push(
    makeSlide(slideCoreArch, 0),
    makeSlide(slideCoreArch02, 0),
);

slides.push(
    makeSlide(slideTimeline, 2),
    makeSlide(slideTimeline, 3),
    makeSlide(slideTimeline, 4),
    makeSlide(slideTimeline, 5),
);

function slideConclusion01(g: StyledDittoContext) {
    let i = 0;
    const next = () => `${i++}`;
    heading(g, next(), 'Closing Thoughts');
    subheading(g, next(), '---------');

    text(g, next(), 'First successful personal project');
    text(g, next(), '- Practiced a new programming style');
    text(g, next(), '- Learned an architectural decoupling technique');
    text(g, next(), '- Managed complexity');
    text(g, next(), '- Made something I can demo');
}

function slideConclusion02(g: StyledDittoContext, version: number) {
    let stop = 0;
    let i = 0;
    const next = () => `${i++}`;
    heading(g, next(), 'Closing Thoughts');
    subheading(g, next(), '---------');

    text(g, next(), 'But...');

    if (version === stop++) { return; }
    text(g, next(), '... I\'m ready for it to end');

    if (version === stop++) { return; }
    heading(g, next(), '                        Thanks!');
}

slides.push(
    makeSlide(slideConclusion01, 0),
    makeSlide(slideConclusion02, 0),
    makeSlide(slideConclusion02, 1),
    makeSlide(slideConclusion02, 2),
);
