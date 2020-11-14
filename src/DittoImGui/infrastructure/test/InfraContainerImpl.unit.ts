import { InfraContainerImpl } from '../InfraContainerImpl';
import { InfraContainer } from '../InfraContainer';
import { FrameTimeTracker, FrameTimeTrackerImpl } from '../FrameTimeTracker';
import { spy } from '../../services/test/spy';

let frameTimeTracker: FrameTimeTracker
let instance: InfraContainer;

beforeEach(() => {
    frameTimeTracker = spy(new FrameTimeTrackerImpl(() => 123));
    instance = new InfraContainerImpl(
        frameTimeTracker,
    );
});

describe('onPreRender', () => {
    describe('when onPreRender is called', () => {
        beforeEach(() => instance.onPreRender());

        test('frameTimeTracker.advanceFrame should be called', () => {
            expect(frameTimeTracker.advanceFrame).toHaveBeenCalled();
        });
    });
});
