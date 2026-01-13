import { Itr } from "./Itr";
import { LinkedQueueNode } from "./LinkedQueueNode";

/**
 * LinkedQueueIterator - Iterator for LinkedQueue.
 */
export class LinkedQueueIterator<T = any> implements Itr<T> {
    private _node: LinkedQueueNode<T> | null;
    private _head: LinkedQueueNode<T> | null;

    constructor(head: LinkedQueueNode<T> | null) {
        this._head = head;
        this._node = head;
    }

    public reset(): void {
        this._node = this._head;
    }

    public next(): T | null {
        if (this._node === null) return null;
        const val = this._node.val;
        this._node = this._node.next;
        return val;
    }

    public hasNext(): boolean {
        return this._node !== null;
    }
}
