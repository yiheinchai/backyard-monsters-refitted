import Point from "openfl/geom/Point";

import { Blink } from "../components/abilities/Blink";
import { CreepBase } from "./CreepBase";

// Lazy imports to break circular dependency chains
function getMonsterBase(): any { return require("../MonsterBase").MonsterBase; }
function getBFOUNDATION(): any { return require("../../../../BFOUNDATION").BFOUNDATION; }



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
