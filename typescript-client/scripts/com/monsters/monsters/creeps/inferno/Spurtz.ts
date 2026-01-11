import Point from "openfl/geom/Point";

import { MonsterBase } from "../../MonsterBase";
import { CreepBase } from "../CreepBase";

import { BFOUNDATION } from "../../../../../BFOUNDATION";
import { EFFECTS } from "../../../../../../EFFECTS";

/**
 * Spurtz - inferno creep that burns on death.
 */
export class Spurtz extends CreepBase {
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

    public override deathSplat(): void {
        EFFECTS.Burn(this._tmpPoint.x, this._tmpPoint.y);
    }
}
