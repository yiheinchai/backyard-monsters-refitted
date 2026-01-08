import { BaseBuff } from "../BaseBuff";
import { InstanceManager } from "../../managers/InstanceManager";
import { MultiplicationPropertyModifier } from "../../monsters/components/modifiers/MultiplicationPropertyModifier";

import { BTOWER } from "../../../../BTOWER";

/**
 * Tower damage multiplier - internal class for tower damage buff.
 */
class TowerDamageMultiplier extends MultiplicationPropertyModifier {
    constructor(multiplier: number) {
        super(multiplier);
    }
}

/**
 * Tower damage buff - increases tower damage for alliance members.
 */
export class TowerDamageBuff extends BaseBuff {
    public static readonly ID: number = 6;

    constructor() {
        super("Tower Damage", "bufficons/towerdamagebuff.png");
    }

    public override get description(): string {
        return "";
    }

    public override apply(): void {
        const towers: Array<any> = InstanceManager.getInstancesByClass(BTOWER);
        for (let i = 0; i < towers.length; i++) {
            const tower: BTOWER = towers[i] as BTOWER;
            tower.damageProperty.addModifier(new TowerDamageMultiplier(this.getValue() * 0.01 + 1));
        }
    }

    public override clear(): void {
        const towers: Array<any> = InstanceManager.getInstancesByClass(BTOWER);
        for (let i = 0; i < towers.length; i++) {
            const tower: BTOWER = towers[i] as BTOWER;
            tower.damageProperty.removeModifier(tower.damageProperty.getModifierByType(TowerDamageMultiplier));
        }
    }
}
