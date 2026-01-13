/**
 * Interface for objects that can loot resources.
 */
export interface ILootable {
    Loot(amount: number): number;
}
