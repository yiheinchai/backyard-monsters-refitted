import { IAttackable } from "../../../interfaces/IAttackable";
import { ITargetable } from "../../../interfaces/ITargetable";
import { AOEDamageOnAttack } from "./AOEDamageOnAttack";

// Lazy imports to break circular dependency chains
function getGLOBAL(): any { return require("../../../../../GLOBAL").GLOBAL; }



/**
 * AOE damage on attack once per target - deals AOE damage only once per unique target.
 */
export class AOEDamageOnAttackOncePerTarget extends AOEDamageOnAttack {
    protected m_lastTarget: IAttackable | null = null;
    protected m_damageMultiplier: number;

    constructor(
        radiusOuter: number,
        targetFlags: number,
        damageMultiplier: number = 1,
        maxTargets: number = 4294967295,
        radiusInner: number = 0,
        includeInitialTarget: boolean = true,
        rechargeDuration: number = 0
    ) {
        super(radiusOuter, targetFlags, maxTargets, radiusInner, includeInitialTarget, rechargeDuration);
        this.m_damageMultiplier = damageMultiplier;
    }

    public override onAttack(target: IAttackable, damageDealt: number, projectile: ITargetable | null = null): number {
        if (getGLOBAL().Timestamp() > this.m_timeAbilityIsRecharged && target !== this.m_lastTarget) {
            this.dealAOEDamage(damageDealt * this.m_damageMultiplier, target);
            this.m_lastTarget = target;
        }
        return 0;
    }
}
