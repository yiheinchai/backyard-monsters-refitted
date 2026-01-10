/**
 * LinkedQueueNode - Node for linked queue.
 */
export class LinkedQueueNode<T = any> {
    public val: T | null = null;
    public next: LinkedQueueNode<T> | null = null;

    constructor(val?: T) {
        if (val !== undefined) {
            this.val = val;
        }
    }
}
