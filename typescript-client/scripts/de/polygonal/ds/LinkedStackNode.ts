import { Itr } from "./Itr";

/**
 * LinkedStackNode - Node for linked stack.
 */
export class LinkedStackNode<T = any> {
    public val: T | null = null;
    public next: LinkedStackNode<T> | null = null;

    constructor(val?: T) {
        if (val !== undefined) {
            this.val = val;
        }
    }
}
