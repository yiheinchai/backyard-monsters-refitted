import { CreepSkinManager } from "../../display/CreepSkinManager";
import { CreepEvent } from "../../events/CreepEvent";
import { Reward } from "../../rewarding/Reward";

import { GLOBAL } from "../../../../GLOBAL";

/**
 * Golden DAVE reward - unlocks golden DAVE skin for subscribers.
 */
export class GoldenDAVEReward extends Reward {
    public static readonly ID: string = "goldenDAVE";
    private static readonly DAVE_CREEP_ID: string = "C12";
    private static readonly GOLD_SKIN_ID: string = "C12Gold";

    constructor() {
        super();
    }

    protected override onApplication(): void {
        const skinId: string | null = this._value ? GoldenDAVEReward.GOLD_SKIN_ID : null;
        CreepSkinManager.instance.SetSkin(GoldenDAVEReward.DAVE_CREEP_ID, skinId);
        GLOBAL.eventDispatcher.addEventListener(CreepEvent.ATTACKING_MONSTER_SPAWNED, this.onAttackingCreepSpawned.bind(this));
        GLOBAL.eventDispatcher.addEventListener(CreepEvent.DEFENDING_CREEP_SPAWNED, this.onDefendingCreepSpawned.bind(this));
    }

    public override removed(): void {
        CreepSkinManager.instance.SetSkin(GoldenDAVEReward.DAVE_CREEP_ID, null);
        GLOBAL.eventDispatcher.removeEventListener(CreepEvent.ATTACKING_MONSTER_SPAWNED, this.onAttackingCreepSpawned.bind(this));
        GLOBAL.eventDispatcher.removeEventListener(CreepEvent.DEFENDING_CREEP_SPAWNED, this.onDefendingCreepSpawned.bind(this));
    }

    public override reset(): void {
        // Empty implementation
    }

    private onAttackingCreepSpawned(event: CreepEvent): void {
        if (GLOBAL.isAtHomeOrInOutpost() && this._value && event.creep && event.creep._creatureID === GoldenDAVEReward.DAVE_CREEP_ID) {
            event.creep.currentSkinOverride = GoldenDAVEReward.DAVE_CREEP_ID;
        }
    }

    private onDefendingCreepSpawned(event: CreepEvent): void {
        if (!GLOBAL.isAtHomeOrInOutpost() && this._value && event.creep && event.creep._creatureID === GoldenDAVEReward.DAVE_CREEP_ID) {
            event.creep.currentSkinOverride = GoldenDAVEReward.DAVE_CREEP_ID;
        }
    }
}
