import { InfraContainer } from './InfraContainer';
import { FrameTimeTracker } from './FrameTimeTracker';

export class InfraContainerImpl implements InfraContainer {
    constructor(
        public readonly frameTimeTracker: FrameTimeTracker,
    ) {
        this.onPreRender = this.onPreRender.bind(this);
    }

    onPreRender(): void {
        this.frameTimeTracker.advanceFrame();
    }
}
