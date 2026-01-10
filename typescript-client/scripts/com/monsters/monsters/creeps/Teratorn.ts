import Point from "openfl/geom/Point";

import { ITargetable } from "../../interfaces/ITargetable";
import { MonsterBase } from "../../MonsterBase";
import { GlavesOnAttack } from "../../components/abilities/GlavesOnAttack";
import { CreepBase } from "./CreepBase";

import { BFOUNDATION } from "../../../../../BFOUNDATION";
import { SPRITES } from "../../../../../SPRITES";
import { FIREBALLS } from "../../../../../FIREBALLS";

/**
 * Teratorn - flying creep with glave ability when powered up.
 */
export class Teratorn extends CreepBase {
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
        SPRITES.SetupSprite("shadow");
        if (this.poweredUp()) {
            this.addComponent(new GlavesOnAttack(this.powerUpLevel()));
        }
    }

    protected override rangedAttack(target: ITargetable): ITargetable {
        if (target instanceof BFOUNDATION) {
            return FIREBALLS.Spawn(
                new Point(this._tmpPoint.x, this._tmpPoint.y - this._altitude),
                this._targetBuilding._position,
                this._targetBuilding,
                6,
                this.damage,
                0,
                0,
                FIREBALLS.TYPE_MAGMA,
                this
            );
        }
        return FIREBALLS.Spawn2(
            this._tmpPoint,
            this._targetCreep._tmpPoint,
            this._targetCreep,
            10,
            this.damage,
            0,
            FIREBALLS.TYPE_MAGMA,
            1,
            this
        );
    }
}
