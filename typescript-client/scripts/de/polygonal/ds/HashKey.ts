/**
 * HashKey - Utility for generating unique hash keys.
 */
export class HashKey {
    public static _counter: number = 0;

    public static next(): number {
        return HashKey._counter++;
    }
}
