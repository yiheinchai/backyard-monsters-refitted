/**
 * DLLNode - Doubly linked list node.
 */
export class DLLNode<T = any> {
    public val: T | null = null;
    public next: DLLNode<T> | null = null;
    public prev: DLLNode<T> | null = null;

    constructor(val?: T) {
        if (val !== undefined) {
            this.val = val;
        }
    }

    public insertAfter(node: DLLNode<T>): void {
        node.next = this.next;
        node.prev = this;
        if (this.next) this.next.prev = node;
        this.next = node;
    }

    public insertBefore(node: DLLNode<T>): void {
        node.prev = this.prev;
        node.next = this;
        if (this.prev) this.prev.next = node;
        this.prev = node;
    }

    public unlink(): void {
        if (this.prev) this.prev.next = this.next;
        if (this.next) this.next.prev = this.prev;
        this.next = null;
        this.prev = null;
    }
}
