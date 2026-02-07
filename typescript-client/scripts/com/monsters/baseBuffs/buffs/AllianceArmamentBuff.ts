import { BaseBuff } from "../BaseBuff";
import { MultiplicationPropertyModifier } from "../../monsters/components/modifiers/MultiplicationPropertyModifier";

// Lazy imports to break circular dependency chains
function getInstanceManager(): any { return require("../../managers/InstanceManager").InstanceManager; }
function getMapRoomManager(): any { return require("../../maproom_manager/MapRoomManager").MapRoomManager; }
function getKEYS(): any { return require("../../../../KEYS").KEYS; }
function getBFOUNDATION(): any { return require("../../../../BFOUNDATION").BFOUNDATION; }
function getBTOWER(): any { return require("../../../../BTOWER").BTOWER; }
function getBWALL(): any { return require("../../../../BWALL").BWALL; }
function getBTRAP(): any { return require("../../../../BTRAP").BTRAP; }



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
        return getKEYS().Get(getMapRoomManager().instance.isInMapRoom2 ? "ap_armament_desc" : "nwm_ap_armament_desc");
    }

    public override apply(): void {
        const buildings: Array<any> = getInstanceManager().getInstancesByClass(getBFOUNDATION());
        for (let i = 0; i < buildings.length; i++) {
            const building: BFOUNDATION = buildings[i] as BFOUNDATION;
            if (building instanceof getBTOWER() || building instanceof getBWALL()) {
                building.maxHealthProperty.store();
                building.maxHealthProperty.addModifier(new ArmamentBuildingDefenseMultiplier());
                building.maxHealthProperty.updateHealth();
            }
        }
        const traps: Array<any> = getInstanceManager().getInstancesByClass(getBTRAP());
        for (let i = 0; i < traps.length; i++) {
            const trap: BTRAP = traps[i] as BTRAP;
            trap.damageProperty.addModifier(new ArmamentTrapDamageMultiplier());
        }
    }

    public override clear(): void {
        const buildings: Array<any> = getInstanceManager().getInstancesByClass(getBFOUNDATION());
        for (let i = 0; i < buildings.length; i++) {
            const building: BFOUNDATION = buildings[i] as BFOUNDATION;
            if (building instanceof getBTOWER() || building instanceof getBWALL()) {
                building.maxHealthProperty.store();
                building.maxHealthProperty.removeModifier(building.maxHealthProperty.getModifierByType(ArmamentBuildingDefenseMultiplier));
                building.maxHealthProperty.updateHealth();
            }
        }
        const traps: Array<any> = getInstanceManager().getInstancesByClass(getBTRAP());
        for (let i = 0; i < traps.length; i++) {
            const trap: BTRAP = traps[i] as BTRAP;
            trap.damageProperty.removeModifier(trap.damageProperty.getModifierByType(ArmamentTrapDamageMultiplier));
        }
    }
}
