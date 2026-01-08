import { IAttackable } from "../../../interfaces/IAttackable";
import { ITargetable } from "../../../interfaces/ITargetable";
import { Component } from "../Component";
import { IAttackingComponent } from "../IAttackingComponent";

import { FIREBALL } from "../../../../../FIREBALL";

/**
 * Glaves on attack - adds glaves to fireball projectile on attack.
 */
export class GlavesOnAttack extends Component implements IAttackingComponent {
    protected m_amountOfGlaves: number;

    constructor(amountOfGlaves: number) {
        super();
        this.m_amountOfGlaves = amountOfGlaves;
    }

    public onAttack(target: IAttackable, damage: number, source: ITargetable | null = null): number {
        if (Boolean(source) && source instanceof FIREBALL) {
            (source as FIREBALL)._glaves = this.m_amountOfGlaves;
        }
        return 0;
    }
}
