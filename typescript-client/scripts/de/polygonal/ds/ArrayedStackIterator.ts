import { Itr } from "./Itr";

/**
 * ArrayedStackIterator - Iterator for ArrayedStack.
 */
export class ArrayedStackIterator<T = any> implements Itr<T> {
    private _a: Array<T | null>;
    private _size: number;
    private _i: number;

    constructor(a: Array<T | null>, size: number) {
        this._a = a;
        this._size = size;
        this._i = size - 1;
    }

    public reset(): void {
        this._i = this._size - 1;
    }

    public next(): T | null {
        if (this._i >= 0) {
            return this._a[this._i--];
        }
        return null;
    }

    public hasNext(): boolean {
        return this._i >= 0;
    }
}
