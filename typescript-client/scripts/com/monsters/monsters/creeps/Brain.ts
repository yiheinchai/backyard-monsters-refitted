import Point from "openfl/geom/Point";

import { MonsterBase } from "../../MonsterBase";
import { Invisibility } from "../../components/abilities/Invisibility";
import { CreepBase } from "./CreepBase";

import { BFOUNDATION } from "../../../../../BFOUNDATION";

/**
 * Brain - creep that can become invisible when powered up.
 */
export class Brain extends CreepBase {
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
            this.addComponent(new Invisibility(this.powerUpLevel()));
        }
    }
}
