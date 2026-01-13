import { IAttackable } from "../../../interfaces/IAttackable";
import { ITargetable } from "../../../interfaces/ITargetable";
import { MonsterBase } from "../../MonsterBase";
import { Component } from "../Component";
import { IAttackingComponent } from "../IAttackingComponent";
import { DOTEffect } from "../statusEffects/DOTEffect";

/**
 * Poison on attack - applies poison damage over time on attack.
 */
export class PoisonOnAttack extends Component implements IAttackingComponent {
    constructor() {
        super();
    }

    public onAttack(target: IAttackable, damage: number, source: ITargetable | null = null): number {
        if (target instanceof MonsterBase) {
            const monster = target as MonsterBase;
            monster.addStatusEffect(new DOTEffect(monster, this.owner.damage * this.owner.powerUpLevel() * 0.1));
        }
        return 0;
    }
}
