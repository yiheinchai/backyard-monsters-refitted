import BitmapData from "openfl/display/BitmapData";
import IBitmapDrawable from "openfl/display/IBitmapDrawable";
import GlowFilter from "openfl/filters/GlowFilter";
import Point from "openfl/geom/Point";

import { SpriteData } from "../display/SpriteData";
import { IAttackable } from "../interfaces/IAttackable";
import { ITargetable } from "../interfaces/ITargetable";
import { Projectilev2 } from "./Projectilev2";
import { ProjectileUtils } from "./ProjectileUtils";

import { EFFECTS } from "../../../EFFECTS";
import { GLOBAL } from "../../../GLOBAL";
import { MAP } from "../../../MAP";
import { SPRITES } from "../../../SPRITES";
import { Targeting } from "../../../Targeting";
import { GameObject } from "../GameObject";

// TweenMax declaration
declare const TweenMax: any;

/**
 * Special projectile used for Rezghul resurrection attacks.
 * Features orbiting motion and electrical effects.
 */
export class ResurrectProjectile extends Projectilev2 {
    public static readonly k_resurecctProjectile: string = "resurrectProjectile";
    public static readonly k_projectileImageURL: string = "monsters/projectiles/rezghul_projectile.png";
    
    private static readonly k_MAX_DISTANCE_TO_LIGHTNING_TARGET: number = 125;
    private static readonly k_PROJECTILE_SPEED: number = 2;
    private static readonly k_ORBIT_RADIUS: number = 10;
    private static readonly k_ORBIT_SPEED: number = 0.05;

    private m_orbitAngle: number = 0;
    private m_filter: GlowFilter | null = null;

    constructor() {
        super();
    }

    public override setup(
        graphic: IBitmapDrawable,
        x: number,
        y: number,
        target: ITargetable,
        speed: number,
        damage: number = 0,
        source: IAttackable | null = null,
        ...components: any[]
    ): void {
        speed = ResurrectProjectile.k_PROJECTILE_SPEED;
        graphic = this.getBitmapData();
        super.setup(graphic, x, y, target, speed, damage, source, ...components);
        
        this.m_filter = new GlowFilter(0xFFFFFF, 0, 9, 9, 1);
        TweenMax.to(this.m_filter, 1, {
            alpha: 0.8,
            yoyo: true
        });
    }

    protected override render(): void {
        if (!this.m_rasterData) return;
        
        const currentData = this.m_rasterData.data as BitmapData;
        const newData = this.getBitmapData();
        
        if (this.m_filter) {
            currentData.applyFilter(newData, newData.rect, new Point(), this.m_filter);
        }
        
        this.m_orbitAngle += ResurrectProjectile.k_ORBIT_SPEED;
        const orbitX = this.m_x + Math.cos(this.m_orbitAngle) * ResurrectProjectile.k_ORBIT_RADIUS;
        const orbitY = this.m_y + Math.sin(this.m_orbitAngle) * ResurrectProjectile.k_ORBIT_RADIUS;
        
        if (Math.random() > 0.75) {
            this.randerElectricityAroundProjectile(new Point(orbitX, orbitY), newData);
        }
        
        const offset = MAP.instance.offset;
        this.m_rasterData.pt = new Point(orbitX - offset.x, orbitY - offset.y);
    }

    private randerElectricityAroundProjectile(position: Point, bitmapData: BitmapData): void {
        let targetPoint: Point | null = null;
        
        const closestEnemy = Targeting.getClosestEnemy(
            ResurrectProjectile.k_MAX_DISTANCE_TO_LIGHTNING_TARGET,
            position,
            Targeting.k_TARGETS_ALL
        );
        
        if (closestEnemy) {
            targetPoint = new Point(closestEnemy.x, closestEnemy.y);
            const distance = GLOBAL.QuickDistance(targetPoint, position);
            
            if (Math.random() > distance / ResurrectProjectile.k_MAX_DISTANCE_TO_LIGHTNING_TARGET) {
                if ((closestEnemy as any) instanceof (globalThis as any).GameObject) {
                    targetPoint = targetPoint.add((closestEnemy as unknown as GameObject).getRandomPointOnGraphic());
                }
            } else {
                targetPoint = null;
            }
        }
        
        if (!targetPoint) {
            targetPoint = new Point(
                position.x + Math.random() * bitmapData.width,
                position.y + Math.random() * bitmapData.height
            );
        }
        
        EFFECTS.Lightning(
            position.x + Math.random() * bitmapData.width,
            position.y + Math.random() * bitmapData.height,
            targetPoint.x,
            targetPoint.y,
            null,
            0x00FF00
        );
    }

    private getBitmapData(): BitmapData {
        let bmd = (SPRITES.GetSpriteDescriptor(ResurrectProjectile.k_resurecctProjectile) as SpriteData)?.sprite;
        if (!bmd) {
            bmd = ProjectileUtils.getFireballBitmapData();
        }
        return bmd.clone();
    }
}
