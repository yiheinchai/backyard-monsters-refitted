import { Collection } from "./Collection";
import { Itr } from "./Itr";
import { Cloneable } from "./Cloneable";
import { HashKey } from "./HashKey";
import { DAIterator } from "./DAIterator";

/**
 * DA - Dynamic Array implementation.
 */
export class DA<T = any> implements Collection<T> {
    public maxSize: number = -1;
    public key: number;
    public _size: number = 0;
    public _a: Array<T | null>;

    constructor(reservedSize: number = 0, maxSize: number = -1) {
        this._a = reservedSize > 0 ? new Array(reservedSize) : [];
        this.maxSize = maxSize;
        this.key = HashKey.next();
    }

    public trim(size: number): void {
        this._size = size;
    }

    public toString(): string {
        return `{DA, size: ${this._size}}`;
    }

    public toDA(): DA<T> {
        const result = new DA<T>(this._size);
        for (let i = 0; i < this._size; i++) {
            result.pushBack(this._a[i] as T);
        }
        return result;
    }

    public toArray(): Array<T> {
        const result: Array<T> = new Array(this._size);
        for (let i = 0; i < this._size; i++) {
            result[i] = this._a[i] as T;
        }
        return result;
    }

    public swp(i: number, j: number): void {
        const tmp = this._a[i];
        this._a[i] = this._a[j];
        this._a[j] = tmp;
        if (i >= this._size) this._size = i + 1;
        if (j >= this._size) this._size = j + 1;
    }

    public swapWithBack(i: number): void {
        const back = this._size - 1;
        if (i < back) {
            const tmp = this._a[back];
            this._a[back] = this._a[i];
            this._a[i] = tmp;
        }
    }

    public sort(compare: ((a: T, b: T) => number) | null = null, useInsertionSort: boolean = false): void {
        if (this._size > 1) {
            if (compare) {
                this._a.length = this._size;
                (this._a as Array<T>).sort(compare);
            }
        }
    }

    public size(): number {
        return this._size;
    }

    public shuffle(rndSeq: DA<number> | null = null): void {
        let n = this._size;
        if (rndSeq === null) {
            while (n > 1) {
                n--;
                const k = Math.floor(Math.random() * n);
                const tmp = this._a[n];
                this._a[n] = this._a[k];
                this._a[k] = tmp;
            }
        } else {
            let rndIdx = 0;
            while (n > 1) {
                n--;
                const k = Math.floor((rndSeq._a[rndIdx++] as number) * n);
                const tmp = this._a[n];
                this._a[n] = this._a[k];
                this._a[k] = tmp;
            }
        }
    }

    public set(i: number, val: T): void {
        this._a[i] = val;
        if (i >= this._size) this._size = i + 1;
    }

    public reverse(): void {
        this._a.length = this._size;
        this._a.reverse();
    }

    public reserve(size: number): void {
        if (this._size === size) return;
        const oldA = this._a;
        this._a = new Array(size);
        const copyLen = Math.min(this._size, size);
        for (let i = 0; i < copyLen; i++) {
            this._a[i] = oldA[i];
        }
    }

    public removeAt(i: number): T | null {
        const val = this._a[i];
        for (let j = i; j < this._size - 1; j++) {
            this._a[j] = this._a[j + 1];
        }
        this._size--;
        return val;
    }

    public remove(item: T): boolean {
        if (this._size === 0) return false;
        let removed = false;
        let i = 0;
        while (i < this._size) {
            if (this._a[i] === item) {
                for (let j = i; j < this._size - 1; j++) {
                    this._a[j] = this._a[j + 1];
                }
                this._size--;
                removed = true;
            } else {
                i++;
            }
        }
        return removed;
    }

    public pushFront(item: T): void {
        for (let i = this._size; i > 0; i--) {
            this._a[i] = this._a[i - 1];
        }
        this._a[0] = item;
        this._size++;
    }

    public pushBack(item: T): void {
        this._a[this._size++] = item;
    }

    public popFront(): T | null {
        if (this._size === 0) return null;
        const val = this._a[0];
        for (let i = 0; i < this._size - 1; i++) {
            this._a[i] = this._a[i + 1];
        }
        this._size--;
        return val;
    }

    public popBack(): T | null {
        if (this._size === 0) return null;
        return this._a[--this._size];
    }

    public pack(): void {
        if (this._a.length === this._size) return;
        const newA: Array<T | null> = new Array(this._size);
        for (let i = 0; i < this._size; i++) {
            newA[i] = this._a[i];
        }
        this._a = newA;
    }

    public indexOf(item: T, fromIndex: number = 0): number {
        for (let i = fromIndex; i < this._size; i++) {
            if (this._a[i] === item) return i;
        }
        return -1;
    }

    public lastIndexOf(item: T, fromIndex: number = -1): number {
        if (this._size === 0) return -1;
        if (fromIndex < 0) fromIndex = this._size + fromIndex;
        for (let i = fromIndex; i >= 0; i--) {
            if (this._a[i] === item) return i;
        }
        return -1;
    }

    public iterator(): Itr<T> {
        return new DAIterator<T>(this);
    }

    public isEmpty(): boolean {
        return this._size === 0;
    }

    public insertAt(i: number, item: T): void {
        for (let j = this._size; j > i; j--) {
            this._a[j] = this._a[j - 1];
        }
        this._a[i] = item;
        this._size++;
    }

    public get(i: number): T | null {
        return this._a[i];
    }

    public front(): T | null {
        return this._a[0] ?? null;
    }

    public back(): T | null {
        return this._size > 0 ? this._a[this._size - 1] : null;
    }

    public free(): void {
        for (let i = 0; i < this._a.length; i++) {
            this._a[i] = null;
        }
        this._a = [];
    }

    public fill(val: T, size: number = 0): void {
        if (size > 0) {
            this._size = size;
        } else {
            size = this._size;
        }
        for (let i = 0; i < size; i++) {
            this._a[i] = val;
        }
    }

    public contains(item: T): boolean {
        for (let i = 0; i < this._size; i++) {
            if (this._a[i] === item) return true;
        }
        return false;
    }

    public concat(other: DA<T>, copy: boolean = false): DA<T> {
        if (copy) {
            const result = new DA<T>();
            result._size = this._size + other._size;
            for (let i = 0; i < this._size; i++) {
                result._a[i] = this._a[i];
            }
            for (let i = 0; i < other._size; i++) {
                result._a[this._size + i] = other._a[i];
            }
            return result;
        }
        for (let i = 0; i < other._size; i++) {
            this._a[this._size++] = other._a[i];
        }
        return this;
    }

    public clone(assign: boolean = true, copier?: (item: T) => T): Collection<T> {
        const result = new DA<T>(this._size, this.maxSize);
        result._size = this._size;
        if (assign) {
            for (let i = 0; i < this._size; i++) {
                result._a[i] = this._a[i];
            }
        } else if (copier) {
            for (let i = 0; i < this._size; i++) {
                result._a[i] = copier(this._a[i] as T);
            }
        } else {
            for (let i = 0; i < this._size; i++) {
                const item = this._a[i];
                if (item && typeof (item as any).clone === 'function') {
                    result._a[i] = (item as any).clone();
                } else {
                    result._a[i] = item;
                }
            }
        }
        return result;
    }

    public clear(purge: boolean = false): void {
        if (purge) {
            for (let i = 0; i < this._a.length; i++) {
                this._a[i] = null;
            }
        }
        this._size = 0;
    }

    public getArray(): Array<T | null> {
        return this._a;
    }
}
