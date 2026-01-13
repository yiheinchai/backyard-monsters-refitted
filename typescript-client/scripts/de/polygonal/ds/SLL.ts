import { Collection } from "./Collection";
import { Itr } from "./Itr";
import { DA } from "./DA";
import { HashKey } from "./HashKey";
import { SLLNode } from "./SLLNode";
import { SLLIterator } from "./SLLIterator";

/**
 * SLL - Singly linked list implementation.
 */
export class SLL<T = any> implements Collection<T> {
    public key: number;
    public head: SLLNode<T> | null = null;
    public tail: SLLNode<T> | null = null;
    private _size: number = 0;

    constructor() {
        this.key = HashKey.next();
    }

    public append(val: T): SLLNode<T> {
        const node = new SLLNode<T>(val);
        if (this.tail) {
            this.tail.next = node;
        }
        this.tail = node;
        if (!this.head) this.head = node;
        this._size++;
        return node;
    }

    public prepend(val: T): SLLNode<T> {
        const node = new SLLNode<T>(val);
        node.next = this.head;
        this.head = node;
        if (!this.tail) this.tail = node;
        this._size++;
        return node;
    }

    public size(): number {
        return this._size;
    }

    public isEmpty(): boolean {
        return this._size === 0;
    }

    public iterator(): Itr<T> {
        return new SLLIterator<T>(this.head);
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
        if (!this.head) return false;
        if (this.head.val === item) {
            this.head = this.head.next;
            if (!this.head) this.tail = null;
            this._size--;
            return true;
        }
        let prev = this.head;
        let curr = this.head.next;
        while (curr) {
            if (curr.val === item) {
                prev.next = curr.next;
                if (curr === this.tail) this.tail = prev;
                this._size--;
                return true;
            }
            prev = curr;
            curr = curr.next;
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
        const result = new SLL<T>();
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
