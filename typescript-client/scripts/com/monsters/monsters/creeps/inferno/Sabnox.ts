import Point from "openfl/geom/Point";

import { ITargetable } from "../../../interfaces/ITargetable";
import { MonsterBase } from "../../MonsterBase";
import { CreepBase } from "../CreepBase";

import { BFOUNDATION } from "../../../../../BFOUNDATION";
import { FIREBALLS } from "../../../../FIREBALLS";

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
        if (target instanceof BFOUNDATION) {
            if (this._targetBuilding._class === "tower") {
                return FIREBALLS.Spawn(
                    this._tmpPoint,
                    this._targetBuilding._position,
                    this._targetBuilding,
                    10,
                    this.damage * 2,
                    0,
                    0,
                    FIREBALLS.TYPE_MAGMA,
                    this
                );
            }
            return FIREBALLS.Spawn(
                this._tmpPoint,
                this._targetBuilding._position,
                this._targetBuilding,
                10,
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
