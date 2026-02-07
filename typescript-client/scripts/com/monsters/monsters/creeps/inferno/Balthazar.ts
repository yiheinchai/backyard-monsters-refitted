import Point from "openfl/geom/Point";

import { CreepBase } from "../CreepBase";

// Lazy imports to break circular dependency chains
function getMonsterBase(): any { return require("../../MonsterBase").MonsterBase; }
function getTargeting(): any { return require("../../../../../Targeting").Targeting; }
function getBFOUNDATION(): any { return require("../../../../../BFOUNDATION").BFOUNDATION; }



/**
 * Balthazar - inferno creep that modifies its defense flags and targeting when powered up.
 */
export class Balthazar extends CreepBase {
    constructor(
        id: string,
        behavior: string,
        spawn: Point,
        rotation: number,
        level: number = 0,
        health: number = 2147483647,
        center: Point | null = null,
        friendly: boolean = false,
        housing: BFOUNDATION | null = null,
        damageMult: number = 1,
        easy: boolean = false,
        monster: MonsterBase | null = null
    ) {
        super(id, behavior, spawn, rotation, level, health, center, friendly, housing, damageMult, easy, monster);
        
        if (Boolean(this.defenseFlags & getTargeting().k_TARGETS_FLYING)) {
            this.defenseFlags ^= getTargeting().k_TARGETS_FLYING;
        }
        if (Boolean(this.defenseFlags & getTargeting().k_TARGETS_GROUND)) {
            this.defenseFlags ^= getTargeting().k_TARGETS_GROUND;
        }
        if (this.poweredUp()) {
            this.targetMode = 1;
        }
    }
}
