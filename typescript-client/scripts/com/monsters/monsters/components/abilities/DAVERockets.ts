import { IAttackable } from "../../../interfaces/IAttackable";
import { ITargetable } from "../../../interfaces/ITargetable";
import { Component } from "../Component";
import { IAttackingComponent } from "../IAttackingComponent";

import { SPRITES } from "../../../../../SPRITES";

/**
 * DAVE rockets - ability that enables rocket attacks for DAVE monster.
 */
export class DAVERockets extends Component implements IAttackingComponent {
    constructor() {
        super();
    }

    protected override onRegister(): void {
        this.owner.targetMode = 1;
        SPRITES.SetupSprite("rocket");
        this.owner.range = 100 + 40 * this.owner.powerUpLevel();
    }

    protected override onUnregister(): void {
        this.owner.targetMode = 0;
        this.owner.range = 1;
    }

    public onAttack(target: IAttackable, damage: number, source: ITargetable | null = null): number {
        return 0;
    }
}
