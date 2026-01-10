import { Stack } from "./Stack";
import { Collection } from "./Collection";
import { Itr } from "./Itr";
import { DA } from "./DA";
import { HashKey } from "./HashKey";
import { ArrayedStackIterator } from "./ArrayedStackIterator";

/**
 * ArrayedStack - Array-based stack implementation.
 */
export class ArrayedStack<T = any> implements Stack<T> {
    public key: number;
    private _a: Array<T | null>;
    private _size: number = 0;

    constructor(initialCapacity: number = 16) {
        this.key = HashKey.next();
        this._a = new Array(initialCapacity);
    }

    public top(): T | null {
        if (this._size === 0) return null;
        return this._a[this._size - 1];
    }

    public push(item: T): void {
        this._a[this._size++] = item;
    }

    public pop(): T | null {
        if (this._size === 0) return null;
        return this._a[--this._size];
    }

    public size(): number {
        return this._size;
    }

    public isEmpty(): boolean {
        return this._size === 0;
    }

    public iterator(): Itr<T> {
        return new ArrayedStackIterator<T>(this._a, this._size);
    }

    public toDA(): DA<T> {
        const result = new DA<T>(this._size);
        for (let i = this._size - 1; i >= 0; i--) {
            result.pushBack(this._a[i] as T);
        }
        return result;
    }

    public toArray(): Array<T> {
        const result: Array<T> = [];
        for (let i = this._size - 1; i >= 0; i--) {
            result.push(this._a[i] as T);
        }
        return result;
    }

    public remove(item: T): boolean {
        for (let i = 0; i < this._size; i++) {
            if (this._a[i] === item) {
                for (let j = i; j < this._size - 1; j++) {
                    this._a[j] = this._a[j + 1];
                }
                this._size--;
                return true;
            }
        }
        return false;
    }

    public contains(item: T): boolean {
        for (let i = 0; i < this._size; i++) {
            if (this._a[i] === item) return true;
        }
        return false;
    }

    public clone(assign: boolean = true, copier?: any): Collection<T> {
        const result = new ArrayedStack<T>(this._a.length);
        for (let i = 0; i < this._size; i++) {
            result.push(this._a[i] as T);
        }
        return result;
    }

    public clear(purge: boolean = false): void {
        if (purge) {
            for (let i = 0; i < this._size; i++) {
                this._a[i] = null;
            }
        }
        this._size = 0;
    }

    public free(): void {
        this._a = [];
        this._size = 0;
    }
}
