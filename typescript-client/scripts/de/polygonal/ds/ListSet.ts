import { Set } from "./Set";
import { Collection } from "./Collection";
import { Itr } from "./Itr";
import { DA } from "./DA";
import { HashKey } from "./HashKey";
import { HashSetIterator } from "./HashSetIterator";

/**
 * ListSet - List-based Set implementation.
 */
export class ListSet<T = any> implements Set<T> {
    public key: number;
    private _items: Array<T> = [];

    constructor() {
        this.key = HashKey.next();
    }

    public set(item: T): boolean {
        if (this.has(item)) return false;
        this._items.push(item);
        return true;
    }

    public has(item: T): boolean {
        return this._items.indexOf(item) !== -1;
    }

    public size(): number {
        return this._items.length;
    }

    public isEmpty(): boolean {
        return this._items.length === 0;
    }

    public iterator(): Itr<T> {
        return new HashSetIterator<T>(this._items);
    }

    public toDA(): DA<T> {
        const result = new DA<T>(this._items.length);
        for (const item of this._items) {
            result.pushBack(item);
        }
        return result;
    }

    public toArray(): Array<T> {
        return [...this._items];
    }

    public remove(item: T): boolean {
        const idx = this._items.indexOf(item);
        if (idx !== -1) {
            this._items.splice(idx, 1);
            return true;
        }
        return false;
    }

    public contains(item: T): boolean {
        return this.has(item);
    }

    public clone(assign: boolean = true, copier?: any): Collection<T> {
        const result = new ListSet<T>();
        for (const item of this._items) {
            result.set(item);
        }
        return result;
    }

    public clear(purge: boolean = false): void {
        this._items.length = 0;
    }

    public free(): void {
        this._items = [];
    }
}
