import { IAttackable } from "../../../interfaces/IAttackable";
import { ITargetable } from "../../../interfaces/ITargetable";
import { IAttackingComponent } from "../IAttackingComponent";
import { AOEDamage } from "./AOEDamage";

// Lazy imports to break circular dependency chains
function getGLOBAL(): any { return require("../../../../../GLOBAL").GLOBAL; }



/**
 * AOE damage on attack - deals AOE damage when monster attacks.
 */
export class AOEDamageOnAttack extends AOEDamage implements IAttackingComponent {
    protected m_rechargeDuration: number;
    protected m_timeAbilityIsRecharged: number = 0;

    constructor(
        radiusOuter: number,
        targetFlags: number,
        maxTargets: number = 4294967295,
        radiusInner: number = 0,
        includeInitialTarget: boolean = true,
        rechargeDuration: number = 0
    ) {
        super(radiusOuter, targetFlags, maxTargets, radiusInner, includeInitialTarget);
        this.m_rechargeDuration = rechargeDuration;
    }

    public onAttack(target: IAttackable, damageDealt: number, projectile: ITargetable | null = null): number {
        if (getGLOBAL().Timestamp() >= this.m_timeAbilityIsRecharged) {
            this.dealAOEDamage(damageDealt, target);
        }
        return 0;
    }

    protected override dealAOEDamage(damage: number, initialTarget: IAttackable | null = null): void {
        super.dealAOEDamage(damage, initialTarget);
        this.m_timeAbilityIsRecharged = getGLOBAL().Timestamp() + this.m_rechargeDuration;
    }
}
