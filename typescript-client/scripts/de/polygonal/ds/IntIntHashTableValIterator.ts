import { Itr } from "./Itr";

/**
 * IntIntHashTableValIterator - Iterator for IntIntHashTable values.
 */
export class IntIntHashTableValIterator implements Itr<number> {
    private _values: Array<number>;
    private _i: number = 0;

    constructor(map: Map<number, number>) {
        this._values = Array.from(map.values());
    }

    public reset(): void {
        this._i = 0;
    }

    public next(): number | null {
        if (this._i < this._values.length) {
            return this._values[this._i++];
        }
        return null;
    }

    public hasNext(): boolean {
        return this._i < this._values.length;
    }
}
