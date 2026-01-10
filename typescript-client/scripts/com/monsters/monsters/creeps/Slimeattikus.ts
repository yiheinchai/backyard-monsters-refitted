import Point from "openfl/geom/Point";

import { MonsterBase } from "../../MonsterBase";
import { DeathSplit } from "../../components/abilities/DeathSplit";
import { CreepBase } from "./CreepBase";

import { BFOUNDATION } from "../../../../../BFOUNDATION";

/**
 * Slimeattikus - special creep that splits on death.
 */
export class Slimeattikus extends CreepBase {
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
        this.addComponent(new DeathSplit(this, "C18"));
    }
}
