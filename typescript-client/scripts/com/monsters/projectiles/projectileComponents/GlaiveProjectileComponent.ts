import Point from "openfl/geom/Point";

import { IAttackable } from "../../interfaces/IAttackable";
import { ITargetable } from "../../interfaces/ITargetable";
import { Projectilev2 } from "../Projectilev2";
import { ProjectileComponent } from "./ProjectileComponent";
import { Targeting } from "../../../../Targeting";

/**
 * Glaive projectile component - chains projectile to additional targets.
 */
export class GlaiveProjectileComponent extends ProjectileComponent {
    private m_targetsLeft: number;
    private m_targetFlags: number;
    private m_range: number;
    private m_targetsAlreadyHit: Array<IAttackable>;

    constructor(bounceCount: number, range: number, targetFlags: number = 0) {
        super();
        this.m_targetsLeft = bounceCount;
        this.m_targetFlags = targetFlags;
        this.m_targetsAlreadyHit = [];
        this.m_range = range;
    }

    public override onAttack(target: IAttackable, damage: number, source: ITargetable | null = null): number {
        if (this.m_targetsLeft > 0) {
            this.m_targetsAlreadyHit.push(target);
            const nextTarget: IAttackable | null = this.getViableTarget(new Point(source!.x, source!.y));
            if (nextTarget) {
                (source as Projectilev2).target = nextTarget;
                (source as Projectilev2).damage = (source as Projectilev2).damage * 0.5;
                --this.m_targetsLeft;
            }
        }
        return damage;
    }

    private getViableTarget(position: Point): IAttackable | null {
        const targets: Array<any> = Targeting.getTargetsInRange(this.m_range, position, this.m_targetFlags);
        if (targets.length > 0) {
            targets.sort((a: any, b: any) => a.dist - b.dist);
            for (let i = 0; i < targets.length; i++) {
                const potentialTarget: IAttackable = targets[i].creep;
                if (this.m_targetsAlreadyHit.indexOf(potentialTarget) === -1) {
                    return potentialTarget;
                }
            }
        }
        return null;
    }
}
