import { IAttackable } from "../../interfaces/IAttackable";
import { ITargetable } from "../../interfaces/ITargetable";
import { FlameEffect } from "../../monsters/components/statusEffects/FlameEffect";
import { ProjectileComponent } from "./ProjectileComponent";

// Lazy imports to break circular dependency chains
function getMonsterBase(): any { return require("../../monsters/MonsterBase").MonsterBase; }


/**
 * Set fire projectile component - applies flame effect on hit.
 */
export class SetFireProjectileComponent extends ProjectileComponent {
    private m_DoT: number;

    constructor(dot: number) {
        super();
        this.m_DoT = dot;
    }

    public override onAttack(target: IAttackable, damage: number, source: ITargetable | null = null): number {
        if (target instanceof getMonsterBase()) {
            (target as MonsterBase).addStatusEffect(new FlameEffect(this.owner, this.m_DoT));
        }
        return damage;
    }
}
