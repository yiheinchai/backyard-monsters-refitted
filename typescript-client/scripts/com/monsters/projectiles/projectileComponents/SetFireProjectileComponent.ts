import { IAttackable } from "../../interfaces/IAttackable";
import { ITargetable } from "../../interfaces/ITargetable";
import { MonsterBase } from "../../monsters/MonsterBase";
import { FlameEffect } from "../../monsters/components/statusEffects/FlameEffect";
import { ProjectileComponent } from "./ProjectileComponent";

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
        if (target instanceof MonsterBase) {
            (target as MonsterBase).addStatusEffect(new FlameEffect(this.owner, this.m_DoT));
        }
        return damage;
    }
}
