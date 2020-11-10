import { FrameTimeTracker } from '../FrameTimeTracker';
import { FrameTimeTrackerImpl } from '../FrameTimeTrackerImpl';

let curTime: number;
let getCurTimeFn = jest.fn(() => curTime);
let instance: FrameTimeTracker;

beforeEach(() => {
    curTime = 123123;
    getCurTimeFn = jest.fn(() => curTime);
    instance = new FrameTimeTrackerImpl(getCurTimeFn);
});

describe('constructor', () => {
    test('should call getCurTimeFn', () => {
        expect(getCurTimeFn).toHaveBeenCalled();
    });
});

describe('advanceFrame', () => {
    const mockFrameLength = 65;

    beforeEach(() => {
        getCurTimeFn.mockClear();
        curTime += mockFrameLength;
    });

    test('should call getCurTimeFn', () => {
        instance.advanceFrame();
        expect(getCurTimeFn).toHaveBeenCalled();
    });

    test('after being called, should return change in time', () => {
        instance.advanceFrame();
        expect(instance.getFrameDeltaTime()).toBe(mockFrameLength);
    });
});
