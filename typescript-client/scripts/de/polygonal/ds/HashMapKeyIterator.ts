import { Itr } from "./Itr";

/**
 * HashMapKeyIterator - Iterator for HashMap keys.
 */
export class HashMapKeyIterator<K = any, V = any> implements Itr<K> {
    private _keys: Array<K>;
    private _i: number = 0;

    constructor(map: Map<K, V>) {
        this._keys = Array.from(map.keys());
    }

    public reset(): void {
        this._i = 0;
    }

    public next(): K | null {
        if (this._i < this._keys.length) {
            return this._keys[this._i++];
        }
        return null;
    }

    public hasNext(): boolean {
        return this._i < this._keys.length;
    }
}
