import { Itr } from "./Itr";
import { DA } from "./DA";
import { HashKey } from "./HashKey";

/**
 * IntIntHashTable - Hash table for int-to-int mappings.
 */
export class IntIntHashTable {
    public key: number;
    private _map: Map<number, number>;

    constructor(slotCount: number = 16, capacity: number = 16) {
        this.key = HashKey.next();
        this._map = new Map<number, number>();
    }

    public set(key: number, value: number): boolean {
        const exists = this._map.has(key);
        this._map.set(key, value);
        return !exists;
    }

    public get(key: number): number {
        return this._map.get(key) ?? -1;
    }

    public unset(key: number): boolean {
        return this._map.delete(key);
    }

    public hasKey(key: number): boolean {
        return this._map.has(key);
    }

    public size(): number {
        return this._map.size;
    }

    public isEmpty(): boolean {
        return this._map.size === 0;
    }

    public clear(): void {
        this._map.clear();
    }

    public free(): void {
        this._map.clear();
    }

    public toKeyDA(): DA<number> {
        const result = new DA<number>(this._map.size);
        for (const k of this._map.keys()) {
            result.pushBack(k);
        }
        return result;
    }

    public toValDA(): DA<number> {
        const result = new DA<number>(this._map.size);
        for (const v of this._map.values()) {
            result.pushBack(v);
        }
        return result;
    }
}
