import { Collection } from "./Collection";

/**
 * Set - Set collection interface (unique values).
 */
export interface Set<T = any> extends Collection<T> {
    set(item: T): boolean;
    has(item: T): boolean;
}
