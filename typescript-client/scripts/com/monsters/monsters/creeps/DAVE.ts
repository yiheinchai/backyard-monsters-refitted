import Point from "openfl/geom/Point";

import { ITargetable } from "../../interfaces/ITargetable";
import { DAVERockets } from "../components/abilities/DAVERockets";
import { CreepBase } from "./CreepBase";

// Lazy imports to break circular dependency chains
function getMonsterBase(): any { return require("../MonsterBase").MonsterBase; }
function getBFOUNDATION(): any { return require("../../../../BFOUNDATION").BFOUNDATION; }
function getFIREBALLS(): any { return require("../../../../FIREBALLS").FIREBALLS; }
function getFIREBALL(): any { return require("../../../../FIREBALL").FIREBALL; }
function getSOUNDS(): any { return require("../../../../SOUNDS").SOUNDS; }



/**
 * DAVE - flying creep with dual rocket attacks.
 */
export class DAVE extends CreepBase {
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
        if (this.poweredUp()) {
            this.addComponent(new DAVERockets());
        }
    }

    protected override rangedAttack(target: ITargetable): ITargetable {
        if (target instanceof getBFOUNDATION()) {
            getFIREBALLS().Spawn(
                new Point(this._tmpPoint.x + Math.random() * 20 - 10, this._tmpPoint.y + Math.random() * 20 - 10),
                this._targetBuilding._position,
                this._targetBuilding,
                10,
                this.damage / 2,
                0,
                0,
                getFIREBALL().TYPE_MISSILE,
                this
            );
            return getFIREBALLS().Spawn(
                new Point(this._tmpPoint.x + Math.random() * 20 - 10, this._tmpPoint.y + Math.random() * 20 - 10),
                this._targetBuilding._position,
                this._targetBuilding,
                10,
                this.damage / 2,
                0,
                0,
                getFIREBALL().TYPE_MISSILE,
                this
            );
        }
        getFIREBALLS().Spawn2(
            new Point(this._tmpPoint.x + Math.random() * 20 - 10, this._tmpPoint.y + Math.random() * 20 - 10),
            this._targetCreep._tmpPoint,
            this._targetCreep,
            10,
            this.damage / 2,
            0,
            getFIREBALL().TYPE_MISSILE,
            1,
            this
        );
        return getFIREBALLS().Spawn2(
            new Point(this._tmpPoint.x + Math.random() * 20 - 10, this._tmpPoint.y + Math.random() * 20 - 10),
            this._targetCreep._tmpPoint,
            this._targetCreep,
            10,
            this.damage / 2,
            0,
            getFIREBALL().TYPE_MISSILE,
            1,
            this
        );
    }

    public override deathSplat(): void {
        getSOUNDS().Play("monsterlanddave");
    }
}
