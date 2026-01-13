import { Itr } from "./Itr";

/**
 * Array3Iterator - Iterator for Array3.
 */
export class Array3Iterator<T = any> implements Itr<T> {
    private _a: Array<T | null>;
    private _i: number = 0;

    constructor(a: Array<T | null>) {
        this._a = a;
    }

    public reset(): void {
        this._i = 0;
    }

    public next(): T | null {
        if (this._i < this._a.length) {
            return this._a[this._i++];
        }
        return null;
    }

    public hasNext(): boolean {
        return this._i < this._a.length;
    }
}
