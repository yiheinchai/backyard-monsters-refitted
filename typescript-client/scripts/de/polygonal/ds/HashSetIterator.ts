import { Itr } from "./Itr";

/**
 * HashSetIterator - Iterator for Set implementations.
 */
export class HashSetIterator<T = any> implements Itr<T> {
    private _items: Array<T>;
    private _i: number = 0;

    constructor(items: Array<T>) {
        this._items = items;
    }

    public reset(): void {
        this._i = 0;
    }

    public next(): T | null {
        if (this._i < this._items.length) {
            return this._items[this._i++];
        }
        return null;
    }

    public hasNext(): boolean {
        return this._i < this._items.length;
    }
}
