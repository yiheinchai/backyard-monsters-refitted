import { Collection } from "./Collection";
import { Stack } from "./Stack";
import { Itr } from "./Itr";
import { DA } from "./DA";
import { HashKey } from "./HashKey";
import { LinkedStackNode } from "./LinkedStackNode";
import { LinkedStackIterator } from "./LinkedStackIterator";

/**
 * LinkedStack - Linked list based stack implementation.
 */
export class LinkedStack<T = any> implements Stack<T> {
    public key: number;
    private _head: LinkedStackNode<T> | null = null;
    private _size: number = 0;

    constructor() {
        this.key = HashKey.next();
    }

    public top(): T | null {
        return this._head ? this._head.val : null;
    }

    public push(item: T): void {
        const node = new LinkedStackNode<T>(item);
        node.next = this._head;
        this._head = node;
        this._size++;
    }

    public pop(): T | null {
        if (this._head === null) return null;
        const val = this._head.val;
        this._head = this._head.next;
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
        return new LinkedStackIterator<T>(this._head);
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
            this._size--;
            return true;
        }
        let prev = this._head;
        let curr = this._head.next;
        while (curr) {
            if (curr.val === item) {
                prev.next = curr.next;
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
        const result = new LinkedStack<T>();
        const arr = this.toArray().reverse();
        for (const item of arr) {
            result.push(item);
        }
        return result;
    }

    public clear(purge: boolean = false): void {
        this._head = null;
        this._size = 0;
    }

    public free(): void {
        this.clear(true);
    }
}
