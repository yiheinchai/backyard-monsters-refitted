import { Itr } from "./Itr";
import { DLLNode } from "./DLLNode";

/**
 * DLLIterator - Iterator for DLL (Doubly Linked List).
 */
export class DLLIterator<T = any> implements Itr<T> {
    private _node: DLLNode<T> | null;
    private _head: DLLNode<T> | null;

    constructor(head: DLLNode<T> | null) {
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
