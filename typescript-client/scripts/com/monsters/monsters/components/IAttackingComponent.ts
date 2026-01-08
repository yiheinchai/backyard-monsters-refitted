import { IAttackable } from "../../interfaces/IAttackable";
import { ITargetable } from "../../interfaces/ITargetable";

/**
 * Interface for attack-modifying components.
 */
export interface IAttackingComponent {
    onAttack(target: IAttackable, damage: number, source?: ITargetable | null): number;
}
