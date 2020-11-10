export interface FrameTimeTracker {
    advanceFrame(): void;
    getFrameDeltaTime(): number;
}
