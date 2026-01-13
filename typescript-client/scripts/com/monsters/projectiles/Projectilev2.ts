import BitmapData from "openfl/display/BitmapData";
import IBitmapDrawable from "openfl/display/IBitmapDrawable";
import EventDispatcher from "openfl/events/EventDispatcher";
import Point from "openfl/geom/Point";

import { ProjectileEvent } from "../events/ProjectileEvent";
import { IAttackable } from "../interfaces/IAttackable";
import { ITargetable } from "../interfaces/ITargetable";
import { DummyTarget } from "../monsters/DummyTarget";
import { RasterData } from "../rendering/RasterData";

import { GLOBAL } from "../../../GLOBAL";
import { MAP } from "../../../MAP";
import { GameObject } from "../GameObject";
import { CreepBase } from "../monsters/creeps/CreepBase";

// Interface for tickable
interface ITickable {
    tick(delta: number): void;
}

// Forward declaration for ProjectileComponent
declare class ProjectileComponent {
    tick(delta: number): void;
    onAttack(target: IAttackable, damage: number, projectile: Projectilev2): number;
}

/**
 * Version 2 projectile system with component support.
 */
export class Projectilev2 extends EventDispatcher implements IAttackable, ITickable {
    private static readonly k_DO_PROJECTILES_HAVE_RANDOM_OFFSET: boolean = true;

    public targetOffset: Point | null = null;
    protected m_x: number = 0;
    protected m_y: number = 0;
    protected m_target: ITargetable | null = null;
    protected m_speed: number = 0;
    protected m_damage: number = 0;
    protected m_source: IAttackable | null = null;
    protected m_components: ProjectileComponent[] = [];
    protected m_rasterData: RasterData | null = null;
    protected m_angleToTargetPoint: number = 0;
    protected m_distanceToTarget: number = 0;

    constructor() {
        super();
        this.m_components = [];
    }

    public get rasterData(): RasterData | null {
        return this.m_rasterData;
    }

    public set graphic(value: IBitmapDrawable) {
        // Empty setter as in original
    }

    public get angleToTargetPoint(): number {
        return this.m_angleToTargetPoint;
    }

    public get damage(): number {
        return this.m_damage;
    }

    public set damage(value: number) {
        this.m_damage = value;
    }

    public setup(
        graphic: IBitmapDrawable,
        x: number,
        y: number,
        target: ITargetable,
        speed: number,
        damage: number = 0,
        source: IAttackable | null = null,
        ...components: any[]
    ): void {
        this.m_rasterData = new RasterData(graphic, new Point(x, y), Number.MAX_SAFE_INTEGER);
        this.m_x = x - (this.m_rasterData.data as BitmapData).width * 0.5;
        this.m_y = y - (this.m_rasterData.data as BitmapData).height * 0.5;
        this.m_target = target;
        this.m_speed = speed;
        this.m_damage = damage;
        this.m_source = source;
        GLOBAL.addFastTickable(this);
        
        if (target instanceof (globalThis as any).GameObject && Projectilev2.k_DO_PROJECTILES_HAVE_RANDOM_OFFSET) {
            this.targetOffset = (target as unknown as GameObject).getRandomPointOnGraphic();
        }
        
        for (let i = 0; i < components.length; i++) {
            if (components[i] instanceof (globalThis as any).ProjectileComponent) {
                this.addComponent(components[i]);
            }
        }
    }

    public addComponent(component: ProjectileComponent): void {
        this.m_components.push(component);
    }

    public get x(): number {
        return this.m_x;
    }

    public get y(): number {
        return this.m_y;
    }

    public get targetPoint(): Point {
        if (!this.m_target) return new Point(0, 0);
        const pt = new Point(this.m_target.x, this.m_target.y);
        if (this.targetOffset) {
            return pt.add(this.targetOffset);
        }
        return pt;
    }

    public tick(delta: number = 1): void {
        this.validateTarget();
        this.move();
        
        for (let i = 0; i < this.m_components.length; i++) {
            this.m_components[i].tick(delta);
        }
        
        if (this.m_distanceToTarget - this.m_speed <= 0) {
            this.hit();
        }
        
        if (this.m_target) {
            this.render();
        } else {
            this.destroy();
        }
    }

    protected move(): void {
        const pt = this.targetPoint;
        const dx = pt.x - this.m_x;
        const dy = pt.y - this.m_y;
        this.m_distanceToTarget = Math.sqrt(dx * dx + dy * dy);
        this.m_angleToTargetPoint = Math.atan2(dy, dx);
        this.m_x += Math.cos(this.m_angleToTargetPoint) * this.m_speed;
        this.m_y += Math.sin(this.m_angleToTargetPoint) * this.m_speed;
    }

    private validateTarget(): void {
        if (!this.m_target) return;
        
        const isGameObject = (this.m_target as any) instanceof (globalThis as any).GameObject;
        const isCreepBase = (this.m_target as any) instanceof (globalThis as any).CreepBase;
        
        if ((isGameObject && !(this.m_target as unknown as GameObject).isTargetable) ||
            (isCreepBase && (this.m_target as unknown as CreepBase).invisible)) {
            this.m_target = new DummyTarget(this.m_target.x, this.m_target.y);
        }
    }

    protected render(): void {
        if (!this.m_rasterData) return;
        const offset = MAP.instance.offset;
        this.m_rasterData.pt = new Point(this.m_x - offset.x, this.m_y - offset.y);
    }

    private hit(): void {
        if (!this.m_target) return;
        
        this.dispatchEvent(new ProjectileEvent(ProjectileEvent.k_hit, this.m_target));
        const originalTarget = this.m_target;
        
        if ((this.m_target as any).modifyHealth) {
            const attackable = this.m_target as unknown as IAttackable;
            attackable.modifyHealth(this.m_damage, this);
            
            for (let i = 0; i < this.m_components.length; i++) {
                this.m_damage = this.m_components[i].onAttack(attackable, this.m_damage, this);
            }
        }
        
        if (originalTarget === this.m_target) {
            this.m_target = null;
        }
    }

    protected destroy(): void {
        this.m_damage = 0;
        this.m_speed = 0;
        this.m_x = 0;
        this.m_y = 0;
        this.m_source = null;
        this.m_target = null;
        if (this.m_rasterData) {
            this.m_rasterData.clear();
            this.m_rasterData = null;
        }
        this.targetOffset = null;
        GLOBAL.removeFastTickable(this);
        this.m_components = [];
    }

    public get target(): ITargetable | null {
        return this.m_target;
    }

    public set target(value: ITargetable | null) {
        this.m_target = value;
    }

    public get defenseFlags(): number {
        return 0;
    }

    public get attackFlags(): number {
        return 0;
    }

    public get attackPriorityFlags(): number[] | null {
        return null;
    }

    public get health(): number {
        return 0;
    }

    public get maxHealth(): number {
        return 0;
    }

    public modifyHealth(amount: number, source: ITargetable | null = null): number {
        return 0;
    }

    public copy(target: Projectilev2 | null = null): Projectilev2 {
        if (!target) {
            target = new Projectilev2();
        }
        if (this.m_rasterData && this.m_target) {
            target.setup(
                this.m_rasterData.data as BitmapData,
                this.m_x,
                this.m_y,
                this.m_target,
                this.m_speed,
                this.m_damage,
                this.m_source
            );
        }
        target.targetOffset = this.targetOffset;
        return target;
    }
}
