import Point from "openfl/geom/Point";

import { ITargetable } from "../../interfaces/ITargetable";
import { CreepBase } from "./CreepBase";

// Lazy imports to break circular dependency chains
function getMonsterBase(): any { return require("../MonsterBase").MonsterBase; }
function getTargeting(): any { return require("../../../../Targeting").Targeting; }
function getBFOUNDATION(): any { return require("../../../../BFOUNDATION").BFOUNDATION; }
function getSPRITES(): any { return require("../../../../SPRITES").SPRITES; }
function getSOUNDS(): any { return require("../../../../SOUNDS").SOUNDS; }
function getFIREBALLS(): any { return require("../../../../FIREBALLS").FIREBALLS; }



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
        getSPRITES().SetupSprite("shadow");
        this.attackFlags = getTargeting().getOldStyleTargets(1);
    }

    protected override rangedAttack(target: ITargetable): ITargetable {
        const creatureNum: number = parseInt(this._creatureID.substr(1));
        if (creatureNum < 5) {
            getSOUNDS().Play("hit" + Math.floor(1 + Math.random() * 3), 0.1 + Math.random() * 0.1);
        } else if (creatureNum < 10) {
            getSOUNDS().Play("hit" + Math.floor(3 + Math.random() * 2), 0.1 + Math.random() * 0.1);
        } else {
            getSOUNDS().Play("hit" + Math.floor(4 + Math.random() * 1), 0.1 + Math.random() * 0.1);
        }
        return getFIREBALLS().Spawn2(
            new Point(this._tmpPoint.x, this._tmpPoint.y - this._altitude),
            this._targetCreep._tmpPoint,
            this._targetCreep,
            25,
            this.damage,
            0,
            getFIREBALLS().TYPE_FIREBALL,
            1,
            this
        );
    }
}
