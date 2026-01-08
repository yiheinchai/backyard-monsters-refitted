import { AOEDamageOnAttack } from "./AOEDamageOnAttack";

/**
 * Bandito AOE damage spin - special spinning attack with AOE damage.
 */
export class BanditoAOEDamageSpin extends AOEDamageOnAttack {
    constructor(
        radiusOuter: number,
        targetFlags: number,
        radiusInner: number = 0,
        includeInitialTarget: boolean = true,
        maxTargets: number = 4294967295,
        rechargeDuration: number = 0
    ) {
        super(radiusOuter, targetFlags, maxTargets, radiusInner, includeInitialTarget, rechargeDuration);
    }

    public override tick(delta: number = 1): void {
        if (Boolean(this.owner._targetCreep) && this.owner._atTarget) {
            this.owner._lockRotation = true;
            this.owner._targetRotation += this.owner.attackCooldown * (6 * (0.5 + this.owner.powerUpLevel() * 0.5));
        } else {
            this.owner._lockRotation = false;
        }
    }

    protected override onRegister(): void {
        this.owner.attackDelayProperty.value = this.owner.attackDelay / (1 + this.owner.powerUpLevel() * 0.5);
    }
}
