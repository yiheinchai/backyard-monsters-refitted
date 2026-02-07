import Bitmap from "openfl/display/Bitmap";
import BitmapData from "openfl/display/BitmapData";
import DisplayObject from "openfl/display/DisplayObject";
import Point from "openfl/geom/Point";

import { BYMConfig } from "../../configs/BYMConfig";
import { CreepSkinManager } from "../../display/CreepSkinManager";
import { ITargetable } from "../../interfaces/ITargetable";
import { RezghulResurrectAttack } from "../components/abilities/RezghulResurrectAttack";
import { Zombiefy } from "../components/abilities/Zombiefy";
import { ProjectileUtils } from "../../projectiles/ProjectileUtils";
import { Projectilev2 } from "../../projectiles/Projectilev2";
import { ResurrectProjectile } from "../../projectiles/ResurrectProjectile";
import { RasterData } from "../../rendering/RasterData";
import { CreepBase } from "./CreepBase";

import { LoanShark } from "../../../../org/kissmyas/utils/loanshark/LoanShark";

// Lazy imports to break circular dependency chains
function getMonsterBase(): any { return require("../MonsterBase").MonsterBase; }
function getTargeting(): any { return require("../../../../Targeting").Targeting; }
function getBFOUNDATION(): any { return require("../../../../BFOUNDATION").BFOUNDATION; }
function getSPRITES(): any { return require("../../../../SPRITES").SPRITES; }
function getCREATURES(): any { return require("../../../../CREATURES").CREATURES; }
function getMAP(): any { return require("../../../../MAP").MAP; }


/**
 * Rezghul - creep that can resurrect dead allies as zombies.
 */
export class Rezghul extends CreepBase {
    private static readonly k_projectileSpeed: number = 3;
    private static readonly k_projectilePoolSize: number = 4;

    public static readonly k_ZOMBIE_HEALTH_MULTIPLIER: string = "zombieHealthMultiplier";
    public static readonly k_ZOMBIE_DAMAGE_MULTIPLIER: string = "zombieDamageMultiplier";
    public static readonly k_ZOMBIE_SPEED_MULTIPLIER: string = "zombieSpeedMultiplier";
    public static readonly k_RESSURECT_COOLDOWN: string = "resurrectCooldown";

    private m_projectilePool: LoanShark;

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
        getSPRITES().SetupSprite(ResurrectProjectile.k_resurecctProjectile);
        getSPRITES().SetupSprite("shadow");
        this._shadow = new BitmapData(52, 50, true, 0);
        this._shadowMC = BYMConfig.instance.RENDERER_ON ? new Bitmap(this._shadow) : this.graphic.addChild(new Bitmap(this._shadow));
        this._shadowMC.x = -21;
        this._shadowMC.y = -25;
        if (BYMConfig.instance.RENDERER_ON) {
            this._shadowData = new RasterData(this._shadow, this._shadowPt, getMAP().DEPTH_SHADOW);
        }
        this.m_projectilePool = new LoanShark(Projectilev2, true, Rezghul.k_projectilePoolSize);
        const zombiefyComponent: Zombiefy = new Zombiefy(
            getCREATURES().GetProperty(this._creatureID, Rezghul.k_ZOMBIE_SPEED_MULTIPLIER, startFrame, this._friendly),
            getCREATURES().GetProperty(this._creatureID, Rezghul.k_ZOMBIE_HEALTH_MULTIPLIER, startFrame, this._friendly),
            getCREATURES().GetProperty(this._creatureID, Rezghul.k_ZOMBIE_DAMAGE_MULTIPLIER, startFrame, this._friendly)
        );
        const resurrectProjectile: ResurrectProjectile = new ResurrectProjectile();
        const resurrectAttack: RezghulResurrectAttack = new RezghulResurrectAttack(
            300,
            getCREATURES().GetProperty(this._creatureID, Rezghul.k_RESSURECT_COOLDOWN, startFrame, this._friendly),
            getTargeting().getFriendlyFlag(this) | getTargeting().k_TARGETS_GROUND,
            50,
            resurrectProjectile,
            zombiefyComponent
        );
        this.addComponent(resurrectAttack);
    }

    protected override rangedAttack(target: ITargetable): ITargetable {
        const projectile: Projectilev2 = this.m_projectilePool.borrowObject() as Projectilev2;
        projectile.setup(this.getProjectileBitmapData(), this.x, this.getDisplayY(), target, Rezghul.k_projectileSpeed, -this.damage, this);
        return projectile;
    }

    protected override getNextSprite(): void {
        if (!this._atTarget) {
            this.spriteAction = "moving";
        } else {
            this.spriteAction = "idle";
        }
        getSPRITES().GetSprite(this._shadow!, "shadow", "shadow", 0);
        this._lastFrame = CreepSkinManager.instance.GetSprite(this._graphic, this._creatureID, this.spriteAction, this.m_rotation, this._frameNumber, this._lastFrame, this._currentSkinOverride);
    }

    public override die(): void {
        super.die();
        this.m_projectilePool.dispose();
    }

    private getProjectileBitmapData(): BitmapData {
        return ProjectileUtils.getFomorballBitmapData();
    }
}
