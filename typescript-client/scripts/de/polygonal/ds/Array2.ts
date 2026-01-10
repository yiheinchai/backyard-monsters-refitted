import { Collection } from "./Collection";
import { Itr } from "./Itr";
import { DA } from "./DA";
import { HashKey } from "./HashKey";
import { Array2Iterator } from "./Array2Iterator";

/**
 * Array2 - 2D array implementation.
 */
export class Array2<T = any> implements Collection<T> {
    public key: number;
    private _w: number;
    private _h: number;
    private _a: Array<T | null>;

    constructor(w: number, h: number, val?: T) {
        this.key = HashKey.next();
        this._w = w;
        this._h = h;
        this._a = new Array(w * h);
        if (val !== undefined) {
            this.fill(val);
        }
    }

    public get width(): number { return this._w; }
    public get height(): number { return this._h; }

    public get(x: number, y: number): T | null {
        return this._a[y * this._w + x];
    }

    public set(x: number, y: number, val: T): void {
        this._a[y * this._w + x] = val;
    }

    public getAtIndex(i: number): T | null {
        return this._a[i];
    }

    public setAtIndex(i: number, val: T): void {
        this._a[i] = val;
    }

    public fill(val: T): void {
        for (let i = 0; i < this._a.length; i++) {
            this._a[i] = val;
        }
    }

    public size(): number {
        return this._w * this._h;
    }

    public isEmpty(): boolean {
        return this._w === 0 || this._h === 0;
    }

    public iterator(): Itr<T> {
        return new Array2Iterator<T>(this._a, this._w, this._h);
    }

    public toDA(): DA<T> {
        const result = new DA<T>(this._a.length);
        for (const item of this._a) {
            if (item !== null) result.pushBack(item);
        }
        return result;
    }

    public toArray(): Array<T> {
        return this._a.filter(item => item !== null) as Array<T>;
    }

    public remove(item: T): boolean {
        for (let i = 0; i < this._a.length; i++) {
            if (this._a[i] === item) {
                this._a[i] = null;
                return true;
            }
        }
        return false;
    }

    public contains(item: T): boolean {
        return this._a.indexOf(item) !== -1;
    }

    public clone(assign: boolean = true, copier?: any): Collection<T> {
        const result = new Array2<T>(this._w, this._h);
        for (let i = 0; i < this._a.length; i++) {
            result._a[i] = this._a[i];
        }
        return result;
    }

    public clear(purge: boolean = false): void {
        for (let i = 0; i < this._a.length; i++) {
            this._a[i] = null;
        }
    }

    public free(): void {
        this._a = [];
    }
}
