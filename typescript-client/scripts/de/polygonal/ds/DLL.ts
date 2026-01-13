import { Collection } from "./Collection";
import { Itr } from "./Itr";
import { DA } from "./DA";
import { HashKey } from "./HashKey";
import { DLLNode } from "./DLLNode";
import { DLLIterator } from "./DLLIterator";

/**
 * DLL - Doubly linked list implementation.
 */
export class DLL<T = any> implements Collection<T> {
    public key: number;
    public head: DLLNode<T> | null = null;
    public tail: DLLNode<T> | null = null;
    private _size: number = 0;

    constructor() {
        this.key = HashKey.next();
    }

    public append(val: T): DLLNode<T> {
        const node = new DLLNode<T>(val);
        if (this.tail) {
            this.tail.next = node;
            node.prev = this.tail;
        }
        this.tail = node;
        if (!this.head) this.head = node;
        this._size++;
        return node;
    }

    public prepend(val: T): DLLNode<T> {
        const node = new DLLNode<T>(val);
        if (this.head) {
            this.head.prev = node;
            node.next = this.head;
        }
        this.head = node;
        if (!this.tail) this.tail = node;
        this._size++;
        return node;
    }

    public insertAfter(node: DLLNode<T>, val: T): DLLNode<T> {
        const newNode = new DLLNode<T>(val);
        node.insertAfter(newNode);
        if (node === this.tail) this.tail = newNode;
        this._size++;
        return newNode;
    }

    public insertBefore(node: DLLNode<T>, val: T): DLLNode<T> {
        const newNode = new DLLNode<T>(val);
        node.insertBefore(newNode);
        if (node === this.head) this.head = newNode;
        this._size++;
        return newNode;
    }

    public unlink(node: DLLNode<T>): void {
        if (node === this.head) this.head = node.next;
        if (node === this.tail) this.tail = node.prev;
        node.unlink();
        this._size--;
    }

    public size(): number {
        return this._size;
    }

    public isEmpty(): boolean {
        return this._size === 0;
    }

    public iterator(): Itr<T> {
        return new DLLIterator<T>(this.head);
    }

    public toDA(): DA<T> {
        const result = new DA<T>(this._size);
        let node = this.head;
        while (node) {
            result.pushBack(node.val as T);
            node = node.next;
        }
        return result;
    }

    public toArray(): Array<T> {
        const result: Array<T> = [];
        let node = this.head;
        while (node) {
            result.push(node.val as T);
            node = node.next;
        }
        return result;
    }

    public remove(item: T): boolean {
        let node = this.head;
        while (node) {
            if (node.val === item) {
                this.unlink(node);
                return true;
            }
            node = node.next;
        }
        return false;
    }

    public contains(item: T): boolean {
        let node = this.head;
        while (node) {
            if (node.val === item) return true;
            node = node.next;
        }
        return false;
    }

    public clone(assign: boolean = true, copier?: any): Collection<T> {
        const result = new DLL<T>();
        let node = this.head;
        while (node) {
            result.append(node.val as T);
            node = node.next;
        }
        return result;
    }

    public clear(purge: boolean = false): void {
        this.head = null;
        this.tail = null;
        this._size = 0;
    }

    public free(): void {
        this.clear(true);
    }
}
