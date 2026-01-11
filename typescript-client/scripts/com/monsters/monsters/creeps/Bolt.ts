import Point from "openfl/geom/Point";

import { MonsterBase } from "../MonsterBase";
import { Blink } from "../../components/abilities/Blink";
import { CreepBase } from "./CreepBase";

import { BFOUNDATION } from "../../../../BFOUNDATION";

/**
 * Bolt - creep that can blink when powered up.
 */
export class Bolt extends CreepBase {
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
            this.addComponent(new Blink());
        }
    }
}
