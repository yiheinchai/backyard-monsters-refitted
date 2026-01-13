import BitmapData from "openfl/display/BitmapData";

import { SpriteSheetAnimation } from "../display/SpriteSheetAnimation";
import { Projectilev2 } from "../Projectilev2";
import { ProjectileComponent } from "./ProjectileComponent";

import { SPRITES } from "../../../../SPRITES";

/**
 * Face target projectile component - rotates projectile to face target.
 */
export class FaceTargetProjectileComponent extends ProjectileComponent {
    private m_animation: SpriteSheetAnimation;
    private m_projectile: Projectilev2;

    constructor(projectile: Projectilev2, animation: SpriteSheetAnimation) {
        super();
        this.m_animation = animation;
        this.m_projectile = projectile;
    }

    public override tick(delta: number = 1): void {
        if (Boolean(this.m_projectile.rasterData) && Boolean(this.m_projectile.angleToTargetPoint)) {
            let angle: number = this.m_projectile.angleToTargetPoint * (180 / Math.PI);
            if (angle < 0) {
                angle = 360 + angle;
            }
            const bitmapData: BitmapData = this.m_projectile.rasterData.data as BitmapData;
            SPRITES.GetFrame(bitmapData, this.m_animation.spriteData, angle / this.m_animation.totalFrames);
        }
    }
}
