/**
 * Itr - Iterator interface for traversing collections.
 */
export interface Itr<T = any> {
    reset(): void;
    next(): T | null;
    hasNext(): boolean;
}
