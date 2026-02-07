import { BaseBuff } from "../BaseBuff";
import { ArmorPropertyModifier } from "../../monsters/components/modifiers/ArmorPropertyModifier";

// Lazy imports to break circular dependency chains
function getInstanceManager(): any { return require("../../managers/InstanceManager").InstanceManager; }
function getBFOUNDATION(): any { return require("../../../../BFOUNDATION").BFOUNDATION; }



/**
 * Building defense multiplier - internal class for building defense buff.
 */
class BuildingDefenseMultiplier extends ArmorPropertyModifier {
    constructor(armorBonus: number) {
        super(armorBonus);
    }
}

/**
 * Building defense buff - increases building armor for alliance members.
 */
export class BuildingDefenseBuff extends BaseBuff {
    public static readonly ID: number = 1;

    constructor() {
        super("Tower Defense", "bufficons/towerdefensebuff.png");
    }

    public override get description(): string {
        return "";
    }

    public override apply(): void {
        const buildings: Array<any> = getInstanceManager().getInstancesByClass(BFOUNDATION);
        for (let i = 0; i < buildings.length; i++) {
            const building: BFOUNDATION = buildings[i] as BFOUNDATION;
            building.armorProperty.addModifier(new BuildingDefenseMultiplier(this.getValue() * 0.01));
        }
    }

    public override clear(): void {
        const buildings: Array<any> = getInstanceManager().getInstancesByClass(BFOUNDATION);
        for (let i = 0; i < buildings.length; i++) {
            const building: BFOUNDATION = buildings[i] as BFOUNDATION;
            building.armorProperty.removeModifier(building.damageProperty.getModifierByType(BuildingDefenseMultiplier));
        }
    }
}
