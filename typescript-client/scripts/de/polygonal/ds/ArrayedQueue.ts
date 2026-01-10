import { Collection } from "./Collection";
import { Itr } from "./Itr";
import { DA } from "./DA";
import { HashKey } from "./HashKey";
import { ArrayedQueueIterator } from "./ArrayedQueueIterator";

/**
 * ArrayedQueue - Circular array-based queue implementation.
 */
export class ArrayedQueue<T = any> implements Collection<T> {
    public key: number;
    private _a: Array<T | null>;
    private _front: number = 0;
    private _size: number = 0;
    private _capacity: number;

    constructor(capacity: number = 16) {
        this.key = HashKey.next();
        this._capacity = capacity;
        this._a = new Array(capacity);
    }

    public front(): T | null {
        if (this._size === 0) return null;
        return this._a[this._front];
    }

    public back(): T | null {
        if (this._size === 0) return null;
        return this._a[(this._front + this._size - 1) % this._capacity];
    }

    public enqueue(item: T): void {
        if (this._size === this._capacity) {
            this._grow();
        }
        this._a[(this._front + this._size) % this._capacity] = item;
        this._size++;
    }

    public dequeue(): T | null {
        if (this._size === 0) return null;
        const val = this._a[this._front];
        this._a[this._front] = null;
        this._front = (this._front + 1) % this._capacity;
        this._size--;
        return val;
    }

    private _grow(): void {
        const newCapacity = this._capacity * 2;
        const newA: Array<T | null> = new Array(newCapacity);
        for (let i = 0; i < this._size; i++) {
            newA[i] = this._a[(this._front + i) % this._capacity];
        }
        this._a = newA;
        this._front = 0;
        this._capacity = newCapacity;
    }

    public size(): number {
        return this._size;
    }

    public isEmpty(): boolean {
        return this._size === 0;
    }

    public iterator(): Itr<T> {
        return new ArrayedQueueIterator<T>(this._a, this._front, this._size, this._capacity);
    }

    public toDA(): DA<T> {
        const result = new DA<T>(this._size);
        for (let i = 0; i < this._size; i++) {
            result.pushBack(this._a[(this._front + i) % this._capacity] as T);
        }
        return result;
    }

    public toArray(): Array<T> {
        const result: Array<T> = [];
        for (let i = 0; i < this._size; i++) {
            result.push(this._a[(this._front + i) % this._capacity] as T);
        }
        return result;
    }

    public remove(item: T): boolean {
        for (let i = 0; i < this._size; i++) {
            const idx = (this._front + i) % this._capacity;
            if (this._a[idx] === item) {
                // Shift remaining elements
                for (let j = i; j < this._size - 1; j++) {
                    const currIdx = (this._front + j) % this._capacity;
                    const nextIdx = (this._front + j + 1) % this._capacity;
                    this._a[currIdx] = this._a[nextIdx];
                }
                this._size--;
                return true;
            }
        }
        return false;
    }

    public contains(item: T): boolean {
        for (let i = 0; i < this._size; i++) {
            if (this._a[(this._front + i) % this._capacity] === item) return true;
        }
        return false;
    }

    public clone(assign: boolean = true, copier?: any): Collection<T> {
        const result = new ArrayedQueue<T>(this._capacity);
        for (let i = 0; i < this._size; i++) {
            result.enqueue(this._a[(this._front + i) % this._capacity] as T);
        }
        return result;
    }

    public clear(purge: boolean = false): void {
        if (purge) {
            for (let i = 0; i < this._capacity; i++) {
                this._a[i] = null;
            }
        }
        this._front = 0;
        this._size = 0;
    }

    public free(): void {
        this._a = [];
        this._size = 0;
    }
}
