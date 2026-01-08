import { Point } from "openfl/geom/Point";

import { MonsterBase } from "../../../MonsterBase";
import { CreepBase } from "../CreepBase";

import { BFOUNDATION } from "../../../../../../BFOUNDATION";

/**
 * Banditov2 - rebalanced bandito creep.
 */
export class Banditov2 extends CreepBase {
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
}
