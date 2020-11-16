// JavaScript does not permit bitwise operations above 32 bits
export const MAX_FLAGS_PER_BITFIELD = 31;

export function flagFactory() {
    let flagsSoFar = 0;

    return function flag(): number {
        if  (flagsSoFar >= MAX_FLAGS_PER_BITFIELD) {
            throw new Error('maximum flag value exceeded');
        }

        return 1 << (flagsSoFar++);
    }
}
