import Point from "openfl/geom/Point";

import { MonsterBase } from "../MonsterBase";
import { AOEDamageOnAttack } from "../../components/abilities/AOEDamageOnAttack";
import { Targeting } from "../../../../Targeting";
import { CreepBase } from "./CreepBase";

import { BFOUNDATION } from "../../../../BFOUNDATION";

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
            let flags = Targeting.k_TARGETS_BUILDINGS | Targeting.k_TARGETS_GROUND;
            flags |= friendly ? Targeting.k_TARGETS_ATTACKERS : Targeting.k_TARGETS_DEFENDERS;
            this.addComponent(new AOEDamageOnAttack(60, flags, this.powerUpLevel(), 60, false));
        }
    }
}
