import { IAttackable } from "../../interfaces/IAttackable";
import { ITargetable } from "../../interfaces/ITargetable";
import { Component } from "../../monsters/components/Component";
import { IAttackingComponent } from "../../monsters/components/IAttackingComponent";

/**
 * Projectile component - base class for projectile behavior components.
 */
export class ProjectileComponent extends Component implements IAttackingComponent {
    constructor() {
        super();
    }

    public onAttack(target: IAttackable, damage: number, source: ITargetable | null = null): number {
        return 0;
    }
}
