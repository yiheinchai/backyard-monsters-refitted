import Point from "openfl/geom/Point";

import { ITargetable } from "../../../interfaces/ITargetable";
import { CreepBase } from "../CreepBase";

// Lazy imports to break circular dependency chains
function getMonsterBase(): any { return require("../../MonsterBase").MonsterBase; }
function getBFOUNDATION(): any { return require("../../../../../BFOUNDATION").BFOUNDATION; }
function getFIREBALLS(): any { return require("../../../../../FIREBALLS").FIREBALLS; }



/**
 * Sabnox - inferno creep with ranged magma attack that deals double damage to towers.
 */
export class Sabnox extends CreepBase {
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
    }

    protected override rangedAttack(target: ITargetable): ITargetable {
        if (target instanceof getBFOUNDATION()) {
            if (this._targetBuilding._class === "tower") {
                return getFIREBALLS().Spawn(
                    this._tmpPoint,
                    this._targetBuilding._position,
                    this._targetBuilding,
                    10,
                    this.damage * 2,
                    0,
                    0,
                    getFIREBALLS().TYPE_MAGMA,
                    this
                );
            }
            return getFIREBALLS().Spawn(
                this._tmpPoint,
                this._targetBuilding._position,
                this._targetBuilding,
                10,
                this.damage,
                0,
                0,
                getFIREBALLS().TYPE_MAGMA,
                this
            );
        }
        return getFIREBALLS().Spawn2(
            this._tmpPoint,
            this._targetCreep._tmpPoint,
            this._targetCreep,
            10,
            this.damage,
            0,
            getFIREBALLS().TYPE_MAGMA,
            1,
            this
        );
    }
}
