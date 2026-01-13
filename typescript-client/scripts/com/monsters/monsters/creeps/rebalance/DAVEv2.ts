import Point from "openfl/geom/Point";

import { SpriteData } from "../../../display/SpriteData";
import { SpriteSheetAnimation } from "../../../display/SpriteSheetAnimation";
import { ITargetable } from "../../../interfaces/ITargetable";
import { MonsterBase } from "../../MonsterBase";
import { CreepBase } from "../CreepBase";
import { Projectilev2 } from "../../../projectiles/Projectilev2";
import { FaceTargetProjectileComponent } from "../../../projectiles/projectileComponents/FaceTargetProjectileComponent";

import { BFOUNDATION } from "../../../../../BFOUNDATION";
import { SPRITES } from "../../../../SPRITES";
import { SOUNDS } from "../../../../SOUNDS";
import { LoanShark } from "org/kissmyas/utils/loanshark/LoanShark";

/**
 * DAVE v2 - rebalanced DAVE creep with dual rocket attack.
 */
export class DAVEv2 extends CreepBase {
    private static readonly k_rocketKey: string = "rocket";
    private static readonly k_rocketSpeed: number = 8;
    private static readonly k_projectilePoolSize: number = 4;

    private m_projectilePool: LoanShark | null = null;

    constructor(
        id: string,
        type: string,
        startPos: Point,
        velocity: number,
        startFrame: number = 0,
        endFrame: number = 2147483647,
        targetPos: Point | null = null,
        ownedByAttacker: boolean = false,
        building: BFOUNDATION | null = null,
        scale: number = 1,
        flipped: boolean = false,
        parent: MonsterBase | null = null
    ) {
        super(id, type, startPos, velocity, startFrame, endFrame, targetPos, ownedByAttacker, building, scale, flipped, parent);
        if (this.powerUpLevel()) {
            this.targetMode = 1;
            SPRITES.SetupSprite(DAVEv2.k_rocketKey);
            this.range = 100 + 40 * this.powerUpLevel();
            this.m_projectilePool = new LoanShark(Projectilev2, true, DAVEv2.k_projectilePoolSize);
        }
    }

    protected override rangedAttack(target: ITargetable): ITargetable {
        const halfDamage: number = this.damage * 0.5;
        const animation: SpriteSheetAnimation = new SpriteSheetAnimation(SPRITES.GetSpriteDescriptor(DAVEv2.k_rocketKey) as SpriteData, 11);

        // First rocket
        let projectile: Projectilev2 = this.m_projectilePool!.borrowObject() as Projectilev2;
        let spawnPoint: Point = new Point(this._tmpPoint.x + Math.random() * 20 - 10, this._tmpPoint.y + Math.random() * 20 - 10);
        let faceComponent: FaceTargetProjectileComponent = new FaceTargetProjectileComponent(projectile, animation);
        projectile.setup(animation.bitmapData, spawnPoint.x, spawnPoint.y, target, DAVEv2.k_rocketSpeed, halfDamage, this, faceComponent);

        // Second rocket
        projectile = this.m_projectilePool!.borrowObject() as Projectilev2;
        spawnPoint = new Point(this._tmpPoint.x + Math.random() * 20 - 10, this._tmpPoint.y + Math.random() * 20 - 10);
        faceComponent = new FaceTargetProjectileComponent(projectile, animation);
        projectile.setup(animation.bitmapData, spawnPoint.x, spawnPoint.y, target, DAVEv2.k_rocketSpeed, halfDamage, this, faceComponent);

        return projectile;
    }

    public override die(): void {
        super.die();
        if (this.m_projectilePool) {
            this.m_projectilePool.dispose();
        }
    }

    public override deathSplat(): void {
        SOUNDS.Play("monsterlanddave");
    }
}
