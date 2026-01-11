import Shape from "openfl/display/Shape";
import Event from "openfl/events/Event";
import Point from "openfl/geom/Point";

import { IAttackable } from "../../../interfaces/IAttackable";
import { ITargetable } from "../../../interfaces/ITargetable";
import { ITickable } from "../../../interfaces/ITickable";
import { IComponentOwner } from "../../IComponentOwner";
import { MonsterBase } from "../../MonsterBase";
import { Component } from "../Component";
import { AcidStatusEffect } from "../statusEffects/AcidStatusEffect";
import { Targeting } from "../../../../../Targeting";

import { GLOBAL } from "../../../../../GLOBAL";
import { MAP } from "../../../../../MAP";

/**
 * AcidOnDeath - component that creates an acid pool when the monster dies.
 */
export class AcidOnDeath extends Component {
    private m_radius: number;
    private m_damage: number;
    private m_duration: number;
    private m_acidPool: AcidPool | null = null;

    constructor(radius: number, damage: number, duration: number) {
        super();
        this.m_radius = radius;
        this.m_damage = damage;
        this.m_duration = duration;
    }

    public set damage(value: number) {
        this.m_damage = value;
        if (this.m_acidPool) {
            this.m_acidPool.damage = value;
        }
    }

    protected override onRegister(): void {
        this.owner.addEventListener(MonsterBase.k_DEATH_EVENT, this.onDeath.bind(this));
    }

    protected override onUnregister(): void {
        this.owner.removeEventListener(MonsterBase.k_DEATH_EVENT, this.onDeath.bind(this));
    }

    protected onDeath(event: Event | null = null): void {
        this.addAcidPool();
    }

    private addAcidPool(): void {
        this.m_acidPool = new AcidPool(this.owner.x, this.owner.y, this.m_damage, this.m_radius);
        this.m_acidPool.timeActivated = GLOBAL.Timestamp();
        MAP._CREEPSMC.addChild(this.m_acidPool.graphic);
        GLOBAL.addTickable(this);
    }

    private removeAcidPool(): void {
        MAP._CREEPSMC.removeChild(this.m_acidPool!.graphic);
        this.m_acidPool = null;
        GLOBAL.removeTickable(this);
    }

    public override tick(delta: number = 1): void {
        if (this.m_acidPool) {
            this.m_acidPool.tick(delta);
            if (GLOBAL.Timestamp() - this.m_acidPool.timeActivated >= this.m_duration) {
                this.removeAcidPool();
            }
        }
    }
}

/**
 * AcidPool - the acid pool effect that damages nearby enemies.
 */
class AcidPool implements ITickable, ITargetable {
    public timeActivated: number = 0;
    private m_radius: number;
    private m_damage: number;
    private m_y: number;
    private m_x: number;
    private m_graphic: Shape;

    constructor(px: number, py: number, damage: number, radius: number) {
        this.m_radius = radius;
        this.m_damage = damage;
        this.m_y = py;
        this.m_x = px;
        this.m_graphic = new Shape();
        this.m_graphic.x = this.m_x;
        this.m_graphic.y = this.m_y;
        this.m_graphic.graphics.beginFill(65280, 0.5);
        this.m_graphic.graphics.drawCircle(0, 0, this.m_radius);
        this.m_graphic.graphics.endFill();
    }

    public tick(delta: number = 1): void {
        const targets = Targeting.getAllBUTTargetsInRange(this.m_radius, new Point(this.m_x, this.m_y), Targeting.k_TARGETS_FLYING);
        for (let i = 0; i < targets.length; i++) {
            const attackable = targets[i].creep as IAttackable;
            attackable.modifyHealth(this.m_damage, this);
            if ((attackable as any) instanceof IComponentOwner) {
                const compOwner = attackable as unknown as IComponentOwner;
                if (!compOwner.getComponentByType(AcidStatusEffect)) {
                    compOwner.addComponent(new AcidStatusEffect(attackable as MonsterBase, this.m_damage));
                }
            }
        }
    }

    public get defenseFlags(): number {
        return 0;
    }

    public get graphic(): Shape {
        return this.m_graphic;
    }

    public get x(): number {
        return this.m_x;
    }

    public get y(): number {
        return this.m_y;
    }

    public set damage(value: number) {
        this.m_damage = value;
    }
}
