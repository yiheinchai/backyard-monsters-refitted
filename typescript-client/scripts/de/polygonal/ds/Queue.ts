import { Collection } from "./Collection";

/**
 * Queue - Queue (FIFO) collection interface.
 */
export interface Queue<T = any> extends Collection<T> {
    front(): T | null;
    back(): T | null;
    enqueue(item: T): void;
    dequeue(): T | null;
}
