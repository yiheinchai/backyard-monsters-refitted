import { Itr } from "./Itr";

/**
 * IntIntHashTableKeyIterator - Iterator for IntIntHashTable keys.
 */
export class IntIntHashTableKeyIterator implements Itr<number> {
    private _keys: Array<number>;
    private _i: number = 0;

    constructor(map: Map<number, number>) {
        this._keys = Array.from(map.keys());
    }

    public reset(): void {
        this._i = 0;
    }

    public next(): number | null {
        if (this._i < this._keys.length) {
            return this._keys[this._i++];
        }
        return null;
    }

    public hasNext(): boolean {
        return this._i < this._keys.length;
    }
}
