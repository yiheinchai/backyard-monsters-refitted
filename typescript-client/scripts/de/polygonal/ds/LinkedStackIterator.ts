import { Itr } from "./Itr";
import { LinkedStackNode } from "./LinkedStackNode";

/**
 * LinkedStackIterator - Iterator for LinkedStack.
 */
export class LinkedStackIterator<T = any> implements Itr<T> {
    private _node: LinkedStackNode<T> | null;
    private _head: LinkedStackNode<T> | null;

    constructor(head: LinkedStackNode<T> | null) {
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
