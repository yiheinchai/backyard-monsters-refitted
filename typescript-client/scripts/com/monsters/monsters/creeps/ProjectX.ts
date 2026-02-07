import Point from "openfl/geom/Point";

import { AOEDamageOnDeath } from "../components/abilities/AOEDamageOnDeath";
import { CreepBase } from "./CreepBase";

// Lazy imports to break circular dependency chains
function getMonsterBase(): any { return require("../MonsterBase").MonsterBase; }
function getTargeting(): any { return require("../../../../Targeting").Targeting; }
function getBFOUNDATION(): any { return require("../../../../BFOUNDATION").BFOUNDATION; }



/**
 * Project X - creep with AOE damage on death when powered up.
 */
export class ProjectX extends CreepBase {
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
            let targetFlags = getTargeting().k_TARGETS_BUILDINGS | getTargeting().k_TARGETS_GROUND;
            if (ownedByAttacker) {
                targetFlags |= getTargeting().k_TARGETS_ATTACKERS;
            } else {
                targetFlags |= getTargeting().k_TARGETS_DEFENDERS;
            }
            this.addComponent(new AOEDamageOnDeath(60, targetFlags));
        }
    }
}
