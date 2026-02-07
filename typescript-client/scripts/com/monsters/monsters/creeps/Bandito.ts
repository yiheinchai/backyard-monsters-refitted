import Point from "openfl/geom/Point";

import { BanditoAOEDamageSpin } from "../components/abilities/BanditoAOEDamageSpin";
import { CreepBase } from "./CreepBase";

// Lazy imports to break circular dependency chains
function getMonsterBase(): any { return require("../MonsterBase").MonsterBase; }
function getTargeting(): any { return require("../../../../Targeting").Targeting; }
function getBFOUNDATION(): any { return require("../../../../BFOUNDATION").BFOUNDATION; }



/**
 * Bandito - creep with AOE damage spin ability when powered up.
 */
export class Bandito extends CreepBase {
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
        
        if (this._creatureID === "C7" && this.poweredUp()) {
            let flags = getTargeting().k_TARGETS_GROUND;
            flags |= friendly ? getTargeting().k_TARGETS_ATTACKERS : getTargeting().k_TARGETS_DEFENDERS;
            this.addComponent(new BanditoAOEDamageSpin(60, flags, 60, false));
        }
    }
}
