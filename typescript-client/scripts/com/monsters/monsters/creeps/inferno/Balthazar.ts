import Point from "openfl/geom/Point";

import { MonsterBase } from "../../MonsterBase";
import { Targeting } from "../../../../../Targeting";
import { CreepBase } from "../CreepBase";

import { BFOUNDATION } from "../../../../../BFOUNDATION";

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
        
        if (Boolean(this.defenseFlags & Targeting.k_TARGETS_FLYING)) {
            this.defenseFlags ^= Targeting.k_TARGETS_FLYING;
        }
        if (Boolean(this.defenseFlags & Targeting.k_TARGETS_GROUND)) {
            this.defenseFlags ^= Targeting.k_TARGETS_GROUND;
        }
        if (this.poweredUp()) {
            this.targetMode = 1;
        }
    }
}
