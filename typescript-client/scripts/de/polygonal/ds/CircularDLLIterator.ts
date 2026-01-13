import { Itr } from "./Itr";
import { DLLNode } from "./DLLNode";

/**
 * CircularDLLIterator - Iterator for circular doubly linked list.
 */
export class CircularDLLIterator<T = any> implements Itr<T> {
    private _node: DLLNode<T> | null;
    private _head: DLLNode<T> | null;
    private _started: boolean = false;

    constructor(head: DLLNode<T> | null) {
        this._head = head;
        this._node = head;
    }

    public reset(): void {
        this._node = this._head;
        this._started = false;
    }

    public next(): T | null {
        if (this._node === null) return null;
        const val = this._node.val;
        this._node = this._node.next;
        this._started = true;
        return val;
    }

    public hasNext(): boolean {
        if (!this._started) return this._node !== null;
        return this._node !== null && this._node !== this._head;
    }
}
