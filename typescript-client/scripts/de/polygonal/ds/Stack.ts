import { Collection } from "./Collection";

/**
 * Stack - Stack (LIFO) collection interface.
 */
export interface Stack<T = any> extends Collection<T> {
    top(): T | null;
    push(item: T): void;
    pop(): T | null;
}
