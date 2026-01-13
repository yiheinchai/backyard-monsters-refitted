import { Itr } from "./Itr";

/**
 * ArrayedQueueIterator - Iterator for ArrayedQueue.
 */
export class ArrayedQueueIterator<T = any> implements Itr<T> {
    private _a: Array<T | null>;
    private _front: number;
    private _size: number;
    private _capacity: number;
    private _i: number = 0;

    constructor(a: Array<T | null>, front: number, size: number, capacity: number) {
        this._a = a;
        this._front = front;
        this._size = size;
        this._capacity = capacity;
    }

    public reset(): void {
        this._i = 0;
    }

    public next(): T | null {
        if (this._i < this._size) {
            return this._a[(this._front + this._i++) % this._capacity];
        }
        return null;
    }

    public hasNext(): boolean {
        return this._i < this._size;
    }
}
