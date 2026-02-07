import Point from "openfl/geom/Point";

import { Component } from "../Component";
import { MultiplicationPropertyModifier } from "../modifiers/MultiplicationPropertyModifier";
import { ArmorPropertyModifier } from "../modifiers/ArmorPropertyModifier";

// Lazy imports to break circular dependency chains
function getMonsterBase(): any { return require("../../MonsterBase").MonsterBase; }
function getTargeting(): any { return require("../../../../../Targeting").Targeting; }


/**
 * Zerg damage modifier - internal class for AOEZergBonus.
 */
class ZergDamageModifier extends MultiplicationPropertyModifier {
    constructor(value: number = 0) {
        super(value);
    }
}

/**
 * Zerg armor modifier - internal class for AOEZergBonus.
 */
class ZergArmorModifier extends ArmorPropertyModifier {
    constructor(value: number = 0) {
        super(value);
    }
}

/**
 * AOE Zerg bonus - increases damage and armor based on nearby allies.
 */
export class AOEZergBonus extends Component {
    protected m_type: string;
    protected m_radius: number;
    protected m_modifierPerUnit: number;
    protected m_maxBonus: number;

    constructor(creatureType: string, radius: number = 200, modifierPerUnit: number = 0.5, maxBonus: number = 10) {
        super();
        this.m_modifierPerUnit = modifierPerUnit;
        this.m_radius = radius;
        this.m_type = creatureType;
        this.m_maxBonus = maxBonus;
    }

    public override tick(delta: number = 1): void {
        let allyCount: number = 0;
        const targets: Array<any> = getTargeting().getAllBUTTargetsInRange(this.m_radius, new Point(this.owner.x, this.owner.y), this.owner.targetMode);
        for (let i = 0; i < targets.length; i++) {
            const monster = targets[i] as MonsterBase;
            if (targets[i] === this.owner || !monster) {
                continue;
            }
            if (monster._creatureID === this.m_type) {
                allyCount++;
                if (allyCount >= this.m_maxBonus) {
                    break;
                }
            }
        }
        let damageModifier: ZergDamageModifier | null = this.owner.damageProperty.getModifierByType(ZergDamageModifier) as ZergDamageModifier;
        let armorModifier: ZergArmorModifier | null = this.owner.armorProperty.getModifierByType(ZergArmorModifier) as ZergArmorModifier;
        if (allyCount) {
            if (!damageModifier) {
                damageModifier = new ZergDamageModifier();
                armorModifier = new ZergArmorModifier();
            }
            armorModifier!.multiple = allyCount * this.m_modifierPerUnit;
            damageModifier.multiple = allyCount * this.m_modifierPerUnit;
        } else if (damageModifier) {
            this.owner.damageProperty.removeModifier(damageModifier);
            this.owner.armorProperty.removeModifier(armorModifier!);
        }
    }
}
