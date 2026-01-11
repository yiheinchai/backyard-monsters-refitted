import Point from "openfl/geom/Point";

import { ITargetable } from "../../../interfaces/ITargetable";
import { MonsterBase } from "../../MonsterBase";
import { Targeting } from "../../../../../Targeting";
import { CreepBase } from "../CreepBase";
import { ProjectileUtils } from "../../../projectiles/ProjectileUtils";
import { Projectilev2 } from "../../../projectiles/Projectilev2";

import { BFOUNDATION } from "../../../../../BFOUNDATION";
import { SPRITES } from "../../../../../../SPRITES";
import { SOUNDS } from "../../../../../../SOUNDS";
import { LoanShark } from "org/kissmyas/utils/loanshark/LoanShark";

/**
 * Vorg v2 - rebalanced flying creep with projectile pool.
 */
export class Vorgv2 extends CreepBase {
    private static readonly k_projectilePoolSize: number = 3;

    private m_projectilePool: LoanShark;

    constructor(
        id: string,
        type: string,
        startPos: Point,
        velocity: number,
        startFrame: number = 0,
        endFrame: number = 2147483647,
        targetPos: Point | null = null,
        ownedByAttacker: boolean = false,
        building: BFOUNDATION | null = null,
        scale: number = 1,
        flipped: boolean = false,
        parent: MonsterBase | null = null
    ) {
        super(id, type, startPos, velocity, startFrame, endFrame, targetPos, ownedByAttacker, building, scale, flipped, parent);
        SPRITES.SetupSprite("shadow");
        this.m_projectilePool = new LoanShark(Projectilev2, true, Vorgv2.k_projectilePoolSize);
        this.attackFlags = Targeting.getOldStyleTargets(1);
    }

    protected override rangedAttack(target: ITargetable): ITargetable {
        const projectile: Projectilev2 = this.m_projectilePool.borrowObject() as Projectilev2;
        projectile.setup(ProjectileUtils.getHealballBitmapData(), this.x, this.getDisplayY(), target, ProjectileUtils.k_healballSpeed, this.damage, this);
        SOUNDS.Play("hit" + Math.floor(4 + Math.random() * 1), 0.1 + Math.random() * 0.1);
        return projectile;
    }

    public override die(): void {
        super.die();
        this.m_projectilePool.dispose();
    }
}
