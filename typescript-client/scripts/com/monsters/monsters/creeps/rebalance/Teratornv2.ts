import { Point } from "openfl/geom/Point";

import { ITargetable } from "../../../interfaces/ITargetable";
import { MonsterBase } from "../../../MonsterBase";
import { Targeting } from "../../../Targeting";
import { CreepBase } from "../CreepBase";
import { ProjectileUtils } from "../../../projectiles/ProjectileUtils";
import { Projectilev2 } from "../../../projectiles/Projectilev2";
import { GlaiveProjectileComponent } from "../../../projectiles/projectileComponents/GlaiveProjectileComponent";
import { SetFireProjectileComponent } from "../../../projectiles/projectileComponents/SetFireProjectileComponent";

import { BFOUNDATION } from "../../../../../../BFOUNDATION";
import { SPRITES } from "../../../../../../SPRITES";
import { LoanShark } from "org/kissmyas/utils/loanshark/LoanShark";

/**
 * Teratorn v2 - rebalanced flying creep with glaive and fire projectiles.
 */
export class Teratornv2 extends CreepBase {
    private static readonly k_maxGlaiveTargets: number = 3;
    private static readonly k_glaiveRange: number = 100;
    private static readonly k_projectilePoolSize: number = 5;

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
        this.m_projectilePool = new LoanShark(Projectilev2, true, Teratornv2.k_projectilePoolSize);
    }

    protected override rangedAttack(target: ITargetable): ITargetable {
        const powerLevel: number = this.powerUpLevel();
        const projectile: Projectilev2 = this.m_projectilePool.borrowObject() as Projectilev2;
        if (powerLevel) {
            projectile.addComponent(new GlaiveProjectileComponent(
                Teratornv2.k_maxGlaiveTargets,
                Teratornv2.k_glaiveRange,
                Targeting.k_TARGETS_BUILDINGS
            ));
        }
        projectile.addComponent(new SetFireProjectileComponent(this.damage * 0.1));
        projectile.setup(ProjectileUtils.getFireballBitmapData(), this.x, this.getDisplayY(), target, ProjectileUtils.k_fireballSpeed, this.damage, this);
        return projectile;
    }

    public override die(): void {
        super.die();
        this.m_projectilePool.dispose();
    }
}
