import { Itr } from "./Itr";
import { DA } from "./DA";

/**
 * DAIterator - Iterator for DA (Dynamic Array).
 */
export class DAIterator<T = any> implements Itr<T> {
    private _da: DA<T>;
    private _i: number = 0;

    constructor(da: DA<T>) {
        this._da = da;
        this._i = 0;
    }

    public reset(): void {
        this._i = 0;
    }

    public next(): T | null {
        if (this._i < this._da._size) {
            return this._da._a[this._i++] as T;
        }
        return null;
    }

    public hasNext(): boolean {
        return this._i < this._da._size;
    }
}
