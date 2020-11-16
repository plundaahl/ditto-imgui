import { flagFactory, MAX_FLAGS_PER_BITFIELD } from '../FlagFactory';

describe('createFlagFactory', () => {
    test('should return a different number on every call', () => {
        const flag = flagFactory();
        const results: Set<number> = new Set();

        for (let i = 0; i < MAX_FLAGS_PER_BITFIELD; i++) {
            results.add(flag());
        }

        expect(results.size).toBe(MAX_FLAGS_PER_BITFIELD);
    });

    describe('each flag should be power of 2', () => {
        const flag = flagFactory();

        expect(flag()).toBe(1);

        for (let i = 1; i < MAX_FLAGS_PER_BITFIELD; i++) {
            expect(flag() % 2).toBe(0);
        }
    });

    describe('should error if max number of flags exceeded', () => {
        const flag = flagFactory();
        for (let i = 0; i < MAX_FLAGS_PER_BITFIELD; i++) {
            flag();
        }
        expect(flag).toThrow();
    });

    describe('should be able to AND multiple flags together, then extract', () => {
        const flag = flagFactory();

        const FOO = flag();
        const BAR = flag();
        const BAZ = flag();

        const flagSet = FOO | BAR;

        expect(flagSet & FOO).toBeTruthy();
        expect(flagSet & BAR).toBeTruthy();
        expect(flagSet & BAZ).toBeFalsy();
    });
});

