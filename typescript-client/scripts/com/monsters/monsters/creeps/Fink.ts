import Point from "openfl/geom/Point";

import { AOEDamageOnAttack } from "../components/abilities/AOEDamageOnAttack";
import { CreepBase } from "./CreepBase";

// Lazy imports to break circular dependency chains
function getMonsterBase(): any { return require("../MonsterBase").MonsterBase; }
function getTargeting(): any { return require("../../../../Targeting").Targeting; }
function getBFOUNDATION(): any { return require("../../../../BFOUNDATION").BFOUNDATION; }



/**
 * Fink - creep with AOE damage on attack ability when powered up.
 */
export class Fink extends CreepBase {
    constructor(
        creatureID: string,
        behaviour: string,
        spawnPoint: Point,
        rotation: number,
        level: number = 0,
        health: number = 2147483647,
        center: Point | null = null,
        friendly: boolean = false,
        house: BFOUNDATION | null = null,
        damageMult: number = 1,
        goEasy: boolean = false,
        monster: MonsterBase | null = null
    ) {
        super(creatureID, behaviour, spawnPoint, rotation, level, health, center, friendly, house, damageMult, goEasy, monster);
        
        if (this.poweredUp()) {
            let flags = getTargeting().k_TARGETS_BUILDINGS | getTargeting().k_TARGETS_GROUND;
            flags |= friendly ? getTargeting().k_TARGETS_ATTACKERS : getTargeting().k_TARGETS_DEFENDERS;
            this.addComponent(new AOEDamageOnAttack(60, flags, this.powerUpLevel(), 60, false));
        }
    }
}
