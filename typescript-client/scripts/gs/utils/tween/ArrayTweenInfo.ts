/**
 * ArrayTweenInfo - Stores information about tweening array elements.
 */
export class ArrayTweenInfo {
    public index: number;
    public start: number;
    public change: number;

    constructor(index: number, start: number, change: number) {
        this.index = index;
        this.start = start;
        this.change = change;
    }
}
