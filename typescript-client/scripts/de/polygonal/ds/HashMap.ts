import { Map as IMap } from "./Map";
import { Collection } from "./Collection";
import { Set } from "./Set";
import { Itr } from "./Itr";
import { DA } from "./DA";
import { HashKey } from "./HashKey";
import { HashMapKeyIterator } from "./HashMapKeyIterator";
import { HashMapValIterator } from "./HashMapValIterator";
import { ListSet } from "./ListSet";

/**
 * HashMap - Hash-based key-value map implementation.
 */
export class HashMap<K = any, V = any> implements IMap<K, V> {
    public key: number;
    private _map: Map<K, V>;

    constructor() {
        this.key = HashKey.next();
        this._map = new Map<K, V>();
    }

    public set(key: K, value: V): boolean {
        const exists = this._map.has(key);
        this._map.set(key, value);
        return !exists;
    }

    public get(key: K): V | null {
        return this._map.get(key) ?? null;
    }

    public clr(key: K): boolean {
        return this._map.delete(key);
    }

    public has(value: V): boolean {
        for (const v of this._map.values()) {
            if (v === value) return true;
        }
        return false;
    }

    public hasKey(key: K): boolean {
        return this._map.has(key);
    }

    public remap(key: K, value: V): boolean {
        if (!this._map.has(key)) return false;
        this._map.set(key, value);
        return true;
    }

    public keys(): Itr<K> {
        return new HashMapKeyIterator<K, V>(this._map);
    }

    public toValSet(): Set<V> {
        const result = new ListSet<V>();
        for (const v of this._map.values()) {
            result.set(v);
        }
        return result;
    }

    public toKeySet(): Set<K> {
        const result = new ListSet<K>();
        for (const k of this._map.keys()) {
            result.set(k);
        }
        return result;
    }

    public size(): number {
        return this._map.size;
    }

    public isEmpty(): boolean {
        return this._map.size === 0;
    }

    public iterator(): Itr<V> {
        return new HashMapValIterator<K, V>(this._map);
    }

    public toDA(): DA<V> {
        const result = new DA<V>(this._map.size);
        for (const v of this._map.values()) {
            result.pushBack(v);
        }
        return result;
    }

    public toArray(): Array<V> {
        return Array.from(this._map.values());
    }

    public remove(value: V): boolean {
        for (const [k, v] of this._map.entries()) {
            if (v === value) {
                this._map.delete(k);
                return true;
            }
        }
        return false;
    }

    public contains(value: V): boolean {
        return this.has(value);
    }

    public clone(assign: boolean = true, copier?: any): Collection<V> {
        const result = new HashMap<K, V>();
        for (const [k, v] of this._map.entries()) {
            result.set(k, v);
        }
        return result;
    }

    public clear(purge: boolean = false): void {
        this._map.clear();
    }

    public free(): void {
        this._map.clear();
    }
}
