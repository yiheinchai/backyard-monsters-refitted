import { Itr } from "./Itr";

/**
 * HashMapValIterator - Iterator for HashMap values.
 */
export class HashMapValIterator<K = any, V = any> implements Itr<V> {
    private _values: Array<V>;
    private _i: number = 0;

    constructor(map: Map<K, V>) {
        this._values = Array.from(map.values());
    }

    public reset(): void {
        this._i = 0;
    }

    public next(): V | null {
        if (this._i < this._values.length) {
            return this._values[this._i++];
        }
        return null;
    }

    public hasNext(): boolean {
        return this._i < this._values.length;
    }
}
