import Event from "openfl/events/Event";
import Point from "openfl/geom/Point";

import { IAttackable } from "../../../interfaces/IAttackable";
import { ITargetable } from "../../../interfaces/ITargetable";
import { MonsterBase } from "../../MonsterBase";
import { Component } from "../Component";
import { IDefendingComponent } from "../IDefendingComponent";
import { Targeting } from "../../Targeting";

import { PROJECTILE } from "../../../../../PROJECTILE";
import { PROJECTILES } from "../../../../../PROJECTILES";

/**
 * Absorb projectiles - absorbs incoming projectiles and releases them on death.
 */
export class AbsorbProjectiles extends Component implements IDefendingComponent {
    private m_absorbedProjectiles: Array<PROJECTILE>;
    private m_blastRadius: number;
    private m_damageAbsorbed: number = 0;

    constructor(blastRadius: number = 300) {
        super();
        this.m_blastRadius = blastRadius;
        this.m_absorbedProjectiles = [];
    }

    protected override onRegister(): void {
        this.owner.addEventListener(MonsterBase.k_DEATH_EVENT, this.onDeath.bind(this));
    }

    protected override onUnregister(): void {
        this.owner.removeEventListener(MonsterBase.k_DEATH_EVENT, this.onDeath.bind(this));
    }

    private onDeath(event: Event): void {
        const ownerPos: Point = new Point(this.owner.x, this.owner.y);
        const targets: Array<any> = Targeting.getTargetsInRange(
            this.m_blastRadius,
            ownerPos,
            Targeting.getEnemyFlag(this.owner) | Targeting.k_TARGETS_FLYING | Targeting.k_TARGETS_GROUND | Targeting.k_TARGETS_BUILDINGS
        );

        for (let i = 0; i < this.m_absorbedProjectiles.length; i++) {
            const randomIndex: number = Math.floor(Math.random() * (targets.length - 1));
            const target: IAttackable = targets[randomIndex].creep;
            const projectile: PROJECTILE = this.m_absorbedProjectiles[i];
            PROJECTILES.Spawn(ownerPos, new Point(target.x, target.y), target, projectile._maxSpeed, -projectile._damage, projectile._rocket, projectile._splash, projectile._splashTargetFlags);
        }
        this.setOwnerScale(1);
        this.m_absorbedProjectiles = [];
    }

    public onDefend(target: IAttackable, damage: number, source: ITargetable | null = null): number {
        if (source instanceof PROJECTILE && Boolean(this.m_absorbedProjectiles)) {
            const projectile: PROJECTILE = source as PROJECTILE;
            this.m_absorbedProjectiles.push(projectile);
            this.m_damageAbsorbed += projectile._damage;
            const scale: number = 1 + this.m_damageAbsorbed / this.owner.maxHealth;
            this.setOwnerScale(scale);
        }
        return damage;
    }

    private setOwnerScale(scale: number): void {
        this.owner._mc.scaleX = scale;
        this.owner._mc.scaleY = scale;
    }
}
