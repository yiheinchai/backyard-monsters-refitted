import { CreepEvent } from "../../../events/CreepEvent";
import { MonsterDamageBuff } from "./MonsterDamageBuff";

/**
 * Monster defense damage buff - applies damage buff when defending creeps spawn.
 */
export class MonsterDefenseDamageBuff extends MonsterDamageBuff {
    constructor() {
        super(CreepEvent.DEFENDING_CREEP_SPAWNED);
    }
}
