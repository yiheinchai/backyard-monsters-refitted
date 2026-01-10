/**
 * Cloneable - Interface for objects that can be cloned.
 */
export interface Cloneable<T = any> {
    clone(): T;
}
