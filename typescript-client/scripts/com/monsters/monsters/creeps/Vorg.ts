import Point from "openfl/geom/Point";

import { ITargetable } from "../../interfaces/ITargetable";
import { MonsterBase } from "../../MonsterBase";
import { Targeting } from "../../Targeting";
import { CreepBase } from "./CreepBase";

import { BFOUNDATION } from "../../../../../BFOUNDATION";
import { SPRITES } from "../../../../../SPRITES";
import { SOUNDS } from "../../../../../SOUNDS";
import { FIREBALLS } from "../../../../../FIREBALLS";

/**
 * Vorg - flying creep that targets air units with fireballs.
 */
export class Vorg extends CreepBase {
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
        this.attackFlags = Targeting.getOldStyleTargets(1);
    }

    protected override rangedAttack(target: ITargetable): ITargetable {
        const creatureNum: number = parseInt(this._creatureID.substr(1));
        if (creatureNum < 5) {
            SOUNDS.Play("hit" + Math.floor(1 + Math.random() * 3), 0.1 + Math.random() * 0.1);
        } else if (creatureNum < 10) {
            SOUNDS.Play("hit" + Math.floor(3 + Math.random() * 2), 0.1 + Math.random() * 0.1);
        } else {
            SOUNDS.Play("hit" + Math.floor(4 + Math.random() * 1), 0.1 + Math.random() * 0.1);
        }
        return FIREBALLS.Spawn2(
            new Point(this._tmpPoint.x, this._tmpPoint.y - this._altitude),
            this._targetCreep._tmpPoint,
            this._targetCreep,
            25,
            this.damage,
            0,
            FIREBALLS.TYPE_FIREBALL,
            1,
            this
        );
    }
}
