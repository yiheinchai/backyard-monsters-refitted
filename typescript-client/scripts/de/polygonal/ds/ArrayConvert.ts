import { DA } from "./DA";

/**
 * ArrayConvert - Array conversion utilities.
 */
export class ArrayConvert {
    /**
     * Converts a native array to DA.
     */
    public static toDA<T>(arr: Array<T>): DA<T> {
        const result = new DA<T>(arr.length);
        for (const item of arr) {
            result.pushBack(item);
        }
        return result;
    }

    /**
     * Converts a DA to native array.
     */
    public static toArray<T>(da: DA<T>): Array<T> {
        return da.toArray();
    }

    /**
     * Creates a DA from variable arguments.
     */
    public static ofDA<T>(...args: T[]): DA<T> {
        return ArrayConvert.toDA(args);
    }
}
