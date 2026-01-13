import { Collection } from "./Collection";
import { Itr } from "./Itr";
import { Set } from "./Set";

/**
 * Map - Key-value map collection interface.
 */
export interface Map<K = any, V = any> extends Collection<V> {
    toValSet(): Set<V>;
    toKeySet(): Set<K>;
    set(key: K, value: V): boolean;
    remap(key: K, value: V): boolean;
    keys(): Itr<K>;
    hasKey(key: K): boolean;
    has(value: V): boolean;
    get(key: K): V | null;
    clr(key: K): boolean;
}
