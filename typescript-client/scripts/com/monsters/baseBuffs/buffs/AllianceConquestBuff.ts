import { BaseBuff } from "../BaseBuff";
import { MapRoomManager } from "../../maproom_manager/MapRoomManager";
import { MultiplicationPropertyModifier } from "../../monsters/components/modifiers/MultiplicationPropertyModifier";

import { KEYS } from "../../../../KEYS";

/**
 * Conquest attack cost multiplier - internal class for attack cost reduction.
 */
class ConquestAttackCostMultiplier extends MultiplicationPropertyModifier {
    constructor() {
        super(AllianceConquestBuff.k_AttackCostMultiplier);
    }
}

/**
 * Alliance conquest buff - reduces attack cost for alliance members.
 */
export class AllianceConquestBuff extends BaseBuff {
    public static readonly k_AttackCostMultiplier: number = 0.75;
    public static readonly ID: number = 9;

    constructor() {
        super("ap_conquest");
    }

    public override get description(): string {
        return KEYS.Get(MapRoomManager.instance.isInMapRoom2 ? "ap_conquest_desc" : "nwm_ap_conquest_desc");
    }

    public override apply(): void {
        MapRoomManager.instance.attackCostMultiplier.addModifier(new ConquestAttackCostMultiplier());
    }

    public override clear(): void {
        MapRoomManager.instance.attackCostMultiplier.removeModifier(
            MapRoomManager.instance.attackCostMultiplier.getModifierByType(ConquestAttackCostMultiplier)
        );
    }
}
