import { Itr } from "./Itr";
import { SLLNode } from "./SLLNode";

/**
 * SLLIterator - Iterator for SLL (Singly Linked List).
 */
export class SLLIterator<T = any> implements Itr<T> {
    private _node: SLLNode<T> | null;
    private _head: SLLNode<T> | null;

    constructor(head: SLLNode<T> | null) {
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
