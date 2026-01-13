import { BaseBuff } from "../BaseBuff";
import { InstanceManager } from "../../managers/InstanceManager";
import { MapRoomManager } from "../../maproom_manager/MapRoomManager";
import { MultiplicationPropertyModifier } from "../../monsters/components/modifiers/MultiplicationPropertyModifier";

import { KEYS } from "../../../../KEYS";
import { BFOUNDATION } from "../../../../BFOUNDATION";
import { BTOWER } from "../../../../BTOWER";
import { BWALL } from "../../../../BWALL";
import { BTRAP } from "../../../../BTRAP";

/**
 * Armament building defense multiplier - internal class.
 */
class ArmamentBuildingDefenseMultiplier extends MultiplicationPropertyModifier {
    constructor() {
        super(AllianceArmamentBuff.k_ArmorMultiplier);
    }
}

/**
 * Armament trap damage multiplier - internal class.
 */
class ArmamentTrapDamageMultiplier extends MultiplicationPropertyModifier {
    constructor() {
        super(AllianceArmamentBuff.k_DamageMultiplier);
    }
}

/**
 * Alliance armament buff - increases tower/wall defense and trap damage.
 */
export class AllianceArmamentBuff extends BaseBuff {
    public static readonly k_ArmorMultiplier: number = 1.5;
    public static readonly k_DamageMultiplier: number = 1.25;
    public static readonly ID: number = 8;

    constructor() {
        super("ap_armament");
    }

    public override get description(): string {
        return KEYS.Get(MapRoomManager.instance.isInMapRoom2 ? "ap_armament_desc" : "nwm_ap_armament_desc");
    }

    public override apply(): void {
        const buildings: Array<any> = InstanceManager.getInstancesByClass(BFOUNDATION);
        for (let i = 0; i < buildings.length; i++) {
            const building: BFOUNDATION = buildings[i] as BFOUNDATION;
            if (building instanceof BTOWER || building instanceof BWALL) {
                building.maxHealthProperty.store();
                building.maxHealthProperty.addModifier(new ArmamentBuildingDefenseMultiplier());
                building.maxHealthProperty.updateHealth();
            }
        }
        const traps: Array<any> = InstanceManager.getInstancesByClass(BTRAP);
        for (let i = 0; i < traps.length; i++) {
            const trap: BTRAP = traps[i] as BTRAP;
            trap.damageProperty.addModifier(new ArmamentTrapDamageMultiplier());
        }
    }

    public override clear(): void {
        const buildings: Array<any> = InstanceManager.getInstancesByClass(BFOUNDATION);
        for (let i = 0; i < buildings.length; i++) {
            const building: BFOUNDATION = buildings[i] as BFOUNDATION;
            if (building instanceof BTOWER || building instanceof BWALL) {
                building.maxHealthProperty.store();
                building.maxHealthProperty.removeModifier(building.maxHealthProperty.getModifierByType(ArmamentBuildingDefenseMultiplier));
                building.maxHealthProperty.updateHealth();
            }
        }
        const traps: Array<any> = InstanceManager.getInstancesByClass(BTRAP);
        for (let i = 0; i < traps.length; i++) {
            const trap: BTRAP = traps[i] as BTRAP;
            trap.damageProperty.removeModifier(trap.damageProperty.getModifierByType(ArmamentTrapDamageMultiplier));
        }
    }
}
