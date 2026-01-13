import { Set } from "./Set";
import { Collection } from "./Collection";
import { Itr } from "./Itr";
import { DA } from "./DA";
import { HashKey } from "./HashKey";
import { IntHashSetIterator } from "./IntHashSetIterator";

/**
 * IntHashSet - Set implementation optimized for integers.
 */
export class IntHashSet implements Set<number> {
    public key: number;
    private _set: globalThis.Set<number>;

    constructor() {
        this.key = HashKey.next();
        this._set = new globalThis.Set<number>();
    }

    public set(item: number): boolean {
        if (this._set.has(item)) return false;
        this._set.add(item);
        return true;
    }

    public has(item: number): boolean {
        return this._set.has(item);
    }

    public size(): number {
        return this._set.size;
    }

    public isEmpty(): boolean {
        return this._set.size === 0;
    }

    public iterator(): Itr<number> {
        return new IntHashSetIterator(Array.from(this._set));
    }

    public toDA(): DA<number> {
        const result = new DA<number>(this._set.size);
        for (const item of this._set) {
            result.pushBack(item);
        }
        return result;
    }

    public toArray(): Array<number> {
        return Array.from(this._set);
    }

    public remove(item: number): boolean {
        return this._set.delete(item);
    }

    public contains(item: number): boolean {
        return this._set.has(item);
    }

    public clone(assign: boolean = true, copier?: any): Collection<number> {
        const result = new IntHashSet();
        for (const item of this._set) {
            result.set(item);
        }
        return result;
    }

    public clear(purge: boolean = false): void {
        this._set.clear();
    }

    public free(): void {
        this._set.clear();
    }
}
