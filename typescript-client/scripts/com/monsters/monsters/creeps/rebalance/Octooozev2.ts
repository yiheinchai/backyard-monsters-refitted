import Point from "openfl/geom/Point";

import { MonsterBase } from "../../MonsterBase";
import { AbsorbProjectiles } from "../../../components/abilities/AbsorbProjectiles";
import { CreepBase } from "../CreepBase";

import { BFOUNDATION } from "../../../../../BFOUNDATION";

/**
 * Octooozev2 - rebalanced octoooze creep with absorb projectiles ability.
 */
export class Octooozev2 extends CreepBase {
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
            this.addComponent(new AbsorbProjectiles());
        }
    }
}
