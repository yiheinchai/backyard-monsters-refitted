import { BaseBuff } from "../BaseBuff";
import { MultiplicationPropertyModifier } from "../../monsters/components/modifiers/MultiplicationPropertyModifier";

// Lazy imports to break circular dependency chains
function getMapRoomManager(): any { return require("../../maproom_manager/MapRoomManager").MapRoomManager; }
function getKEYS(): any { return require("../../../../KEYS").KEYS; }



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
        return getKEYS().Get(getMapRoomManager().instance.isInMapRoom2 ? "ap_conquest_desc" : "nwm_ap_conquest_desc");
    }

    public override apply(): void {
        getMapRoomManager().instance.attackCostMultiplier.addModifier(new ConquestAttackCostMultiplier());
    }

    public override clear(): void {
        getMapRoomManager().instance.attackCostMultiplier.removeModifier(
            getMapRoomManager().instance.attackCostMultiplier.getModifierByType(ConquestAttackCostMultiplier)
        );
    }
}
