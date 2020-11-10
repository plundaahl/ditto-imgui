import { FrameTimeTracker } from './FrameTimeTracker';

export class FrameTimeTrackerImpl implements FrameTimeTracker {

    private lastTime: number = 0;
    private frameLen: number = 0;

    constructor(
        private readonly getCurrentTimeInMs: () => number,
    ) {
        this.lastTime = getCurrentTimeInMs();
        this.frameLen = 0;
    }

    advanceFrame(): void {
        const newTime = this.getCurrentTimeInMs();
        this.frameLen = newTime - this.lastTime;
        this.lastTime = newTime;
    }

    getFrameDeltaTime(): number {
        return this.frameLen;
    }
}
