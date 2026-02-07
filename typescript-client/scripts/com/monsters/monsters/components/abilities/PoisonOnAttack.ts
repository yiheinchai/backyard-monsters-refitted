import { IAttackable } from "../../../interfaces/IAttackable";
import { ITargetable } from "../../../interfaces/ITargetable";
import { Component } from "../Component";
import { IAttackingComponent } from "../IAttackingComponent";
import { DOTEffect } from "../statusEffects/DOTEffect";

// Lazy imports to break circular dependency chains
function getMonsterBase(): any { return require("../../MonsterBase").MonsterBase; }


/**
 * Poison on attack - applies poison damage over time on attack.
 */
export class PoisonOnAttack extends Component implements IAttackingComponent {
    constructor() {
        super();
    }

    public onAttack(target: IAttackable, damage: number, source: ITargetable | null = null): number {
        if (target instanceof getMonsterBase()) {
            const monster = target as MonsterBase;
            monster.addStatusEffect(new DOTEffect(monster, this.owner.damage * this.owner.powerUpLevel() * 0.1));
        }
        return 0;
    }
}
