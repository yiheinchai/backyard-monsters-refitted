import { CreepEvent } from "../../../events/CreepEvent";
import { MonsterDamageBuff } from "./MonsterDamageBuff";

/**
 * Monster attack damage buff - applies damage buff when attacking monsters spawn.
 */
export class MonsterAttackDamageBuff extends MonsterDamageBuff {
    constructor() {
        super(CreepEvent.ATTACKING_MONSTER_SPAWNED);
    }
}
