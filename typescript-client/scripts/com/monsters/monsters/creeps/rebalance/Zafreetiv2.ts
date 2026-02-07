import BitmapData from "openfl/display/BitmapData";
import Point from "openfl/geom/Point";

import { ITargetable } from "../../../interfaces/ITargetable";
import { AOEHealOnDeath } from "../../components/abilities/AOEHealOnDeath";
import { CreepBase } from "../CreepBase";
import { ProjectileUtils } from "../../../projectiles/ProjectileUtils";
import { Projectilev2 } from "../../../projectiles/Projectilev2";

import { LoanShark } from "../../../../../org/kissmyas/utils/loanshark/LoanShark";

// Lazy imports to break circular dependency chains
function getMonsterBase(): any { return require("../../MonsterBase").MonsterBase; }
function getBFOUNDATION(): any { return require("../../../../../BFOUNDATION").BFOUNDATION; }
function getSPRITES(): any { return require("../../../../../SPRITES").SPRITES; }
function getSOUNDS(): any { return require("../../../../../SOUNDS").SOUNDS; }


/**
 * Zafreeti v2 - rebalanced flying healer creep with AOE heal on death.
 */
export class Zafreetiv2 extends CreepBase {
    private static readonly k_projectilePoolSize: number = 3;

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
        this._graphic = new BitmapData(56, 70, true, 0);
        if (this.poweredUp()) {
            this.addComponent(new AOEHealOnDeath());
        }
        this.m_projectilePool = new LoanShark(Projectilev2, true, Zafreetiv2.k_projectilePoolSize);
        getSPRITES().SetupSprite("bigshadow");
    }

    protected override rangedAttack(target: ITargetable): ITargetable {
        const projectile: Projectilev2 = this.m_projectilePool.borrowObject() as Projectilev2;
        projectile.setup(ProjectileUtils.getHealballBitmapData(), this.x, this.getDisplayY(), target, ProjectileUtils.k_healballSpeed, this.damage, this);
        getSOUNDS().Play("hit" + Math.floor(3 + Math.random() * 2), 0.1 + Math.random() * 0.1);
        return projectile;
    }

    public override die(): void {
        super.die();
        this.m_projectilePool.dispose();
    }
}
