import { Itr } from "./Itr";

/**
 * IntHashSetIterator - Iterator for IntHashSet.
 */
export class IntHashSetIterator implements Itr<number> {
    private _items: Array<number>;
    private _i: number = 0;

    constructor(items: Array<number>) {
        this._items = items;
    }

    public reset(): void {
        this._i = 0;
    }

    public next(): number | null {
        if (this._i < this._items.length) {
            return this._items[this._i++];
        }
        return null;
    }

    public hasNext(): boolean {
        return this._i < this._items.length;
    }
}
