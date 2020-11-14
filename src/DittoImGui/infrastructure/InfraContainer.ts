import { FrameTimeTracker } from './FrameTimeTracker';

export interface InfraContainer {
    readonly frameTimeTracker: FrameTimeTracker,

    onPreRender(): void;
}
