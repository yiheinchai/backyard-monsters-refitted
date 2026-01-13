import { IAttackable } from "../../interfaces/IAttackable";
import { ITargetable } from "../../interfaces/ITargetable";

/**
 * Interface for defense-modifying components.
 */
export interface IDefendingComponent {
    onDefend(target: IAttackable, damage: number, source?: ITargetable | null): number;
}
