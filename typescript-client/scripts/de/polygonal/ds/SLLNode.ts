/**
 * SLLNode - Singly linked list node.
 */
export class SLLNode<T = any> {
    public val: T | null = null;
    public next: SLLNode<T> | null = null;

    constructor(val?: T) {
        if (val !== undefined) {
            this.val = val;
        }
    }
}
