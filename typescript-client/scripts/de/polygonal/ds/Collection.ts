import { Hashable } from "./Hashable";
import { Itr } from "./Itr";
import { DA } from "./DA";

/**
 * Collection - Base interface for all collections.
 */
export interface Collection<T = any> extends Hashable {
    toDA(): DA<T>;
    toArray(): Array<T>;
    size(): number;
    remove(item: T): boolean;
    iterator(): Itr<T>;
    isEmpty(): boolean;
    free(): void;
    contains(item: T): boolean;
    clone(assign: boolean, copier?: any): Collection<T>;
    clear(purge?: boolean): void;
}
