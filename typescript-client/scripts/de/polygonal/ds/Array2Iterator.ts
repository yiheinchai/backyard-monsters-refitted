import { Itr } from "./Itr";

/**
 * Array2Iterator - Iterator for Array2.
 */
export class Array2Iterator<T = any> implements Itr<T> {
    private _a: Array<T | null>;
    private _w: number;
    private _h: number;
    private _i: number = 0;

    constructor(a: Array<T | null>, w: number, h: number) {
        this._a = a;
        this._w = w;
        this._h = h;
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
