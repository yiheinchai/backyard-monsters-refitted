import { Collection } from "./Collection";
import { Itr } from "./Itr";
import { DA } from "./DA";
import { HashKey } from "./HashKey";
import { LinkedQueueNode } from "./LinkedQueueNode";
import { LinkedQueueIterator } from "./LinkedQueueIterator";

/**
 * LinkedQueue - Linked list based queue implementation.
 */
export class LinkedQueue<T = any> implements Collection<T> {
    public key: number;
    private _head: LinkedQueueNode<T> | null = null;
    private _tail: LinkedQueueNode<T> | null = null;
    private _size: number = 0;

    constructor() {
        this.key = HashKey.next();
    }

    public front(): T | null {
        return this._head ? this._head.val : null;
    }

    public back(): T | null {
        return this._tail ? this._tail.val : null;
    }

    public enqueue(item: T): void {
        const node = new LinkedQueueNode<T>(item);
        if (this._tail) {
            this._tail.next = node;
        }
        this._tail = node;
        if (this._head === null) {
            this._head = node;
        }
        this._size++;
    }

    public dequeue(): T | null {
        if (this._head === null) return null;
        const val = this._head.val;
        this._head = this._head.next;
        if (this._head === null) {
            this._tail = null;
        }
        this._size--;
        return val;
    }

    public size(): number {
        return this._size;
    }

    public isEmpty(): boolean {
        return this._size === 0;
    }

    public iterator(): Itr<T> {
        return new LinkedQueueIterator<T>(this._head);
    }

    public toDA(): DA<T> {
        const result = new DA<T>(this._size);
        let node = this._head;
        while (node) {
            result.pushBack(node.val as T);
            node = node.next;
        }
        return result;
    }

    public toArray(): Array<T> {
        const result: Array<T> = [];
        let node = this._head;
        while (node) {
            result.push(node.val as T);
            node = node.next;
        }
        return result;
    }

    public remove(item: T): boolean {
        if (this._head === null) return false;
        if (this._head.val === item) {
            this._head = this._head.next;
            if (this._head === null) this._tail = null;
            this._size--;
            return true;
        }
        let prev = this._head;
        let curr = this._head.next;
        while (curr) {
            if (curr.val === item) {
                prev.next = curr.next;
                if (curr === this._tail) this._tail = prev;
                this._size--;
                return true;
            }
            prev = curr;
            curr = curr.next;
        }
        return false;
    }

    public contains(item: T): boolean {
        let node = this._head;
        while (node) {
            if (node.val === item) return true;
            node = node.next;
        }
        return false;
    }

    public clone(assign: boolean = true, copier?: any): Collection<T> {
        const result = new LinkedQueue<T>();
        let node = this._head;
        while (node) {
            result.enqueue(node.val as T);
            node = node.next;
        }
        return result;
    }

    public clear(purge: boolean = false): void {
        this._head = null;
        this._tail = null;
        this._size = 0;
    }

    public free(): void {
        this.clear(true);
    }
}
