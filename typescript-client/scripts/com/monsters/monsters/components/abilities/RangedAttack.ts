import Point from "openfl/geom/Point";

import { ITargetable } from "../../../interfaces/ITargetable";
import { Component } from "../Component";
import { ProjectileUtils } from "../../../projectiles/ProjectileUtils";
import { Projectilev2 } from "../../../projectiles/Projectilev2";

import { LoanShark } from "../../../../../org/kissmyas/utils/loanshark/LoanShark";

// Lazy imports to break circular dependency chains
function getTargeting(): any { return require("../../../../../Targeting").Targeting; }
function getGLOBAL(): any { return require("../../../../../GLOBAL").GLOBAL; }


/**
 * Ranged attack - fires projectiles at targets within range.
 */
export class RangedAttack extends Component {
    private static readonly k_projectileSpeed: number = 2;
    private static readonly k_projectilePoolSize: number = 2;

    protected m_range: number;
    protected m_rechargeDuration: number;
    protected m_timeRechargeIsComplete: number = 0;
    protected m_projectilePool: LoanShark | null = null;
    protected m_projectile: Projectilev2;
    protected m_targetFlags: number;

    constructor(range: number, rechargeDuration: number, targetFlags: number, projectile: Projectilev2) {
        super();
        this.m_range = range;
        this.m_rechargeDuration = rechargeDuration;
        this.m_projectile = projectile;
        this.m_targetFlags = targetFlags;
    }

    protected override onRegister(): void {
        this.m_projectilePool = new LoanShark((this.m_projectile as any).constructor, true, RangedAttack.k_projectilePoolSize);
    }

    protected override onUnregister(): void {
        if (this.m_projectilePool) {
            this.m_projectilePool.dispose();
        }
    }

    public override tick(delta: number = 1): void {
        if (getGLOBAL().Timestamp() >= this.m_timeRechargeIsComplete) {
            const targets: Array<ITargetable> | null = this.getValidTargetsInRange(this.m_range, new Point(this.owner.x, this.owner.y), this.m_targetFlags);
            if (Boolean(targets) && targets!.length > 0) {
                this.fireAt(targets![0]);
                this.m_timeRechargeIsComplete = getGLOBAL().Timestamp() + this.m_rechargeDuration;
            }
        }
    }

    protected getValidTargetsInRange(range: number, position: Point, targetFlags: number): Array<ITargetable> | null {
        let validTargets: Array<ITargetable> | null = null;
        const targets: Array<any> = getTargeting().getTargetsInRange(range, position, targetFlags);
        for (let i = 0; i < targets.length; i++) {
            if (!validTargets) {
                validTargets = [];
            }
            validTargets.push(targets[i].creep);
        }
        return validTargets;
    }

    protected fireAt(target: ITargetable): Projectilev2 {
        const projectile: Projectilev2 = this.m_projectilePool!.borrowObject() as Projectilev2;
        projectile.setup(ProjectileUtils.getFireballBitmapData(), this.owner.x, this.owner.getDisplayY(), target, ProjectileUtils.k_fireballSpeed, 0, this.owner);
        return projectile;
    }
}
