import { ITargetable } from "./ITargetable";

/**
 * Interface for objects that can take damage and be attacked.
 */
export interface IAttackable extends ITargetable {
    modifyHealth(amount: number, source?: ITargetable | null): number;
    get maxHealth(): number;
    get health(): number;
    get attackFlags(): number;
    get attackPriorityFlags(): number[];
}
