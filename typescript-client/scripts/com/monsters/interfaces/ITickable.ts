/**
 * Interface for objects that update on game ticks.
 */
export interface ITickable {
    tick(ticks?: number): void;
}
