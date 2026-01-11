import Point from "openfl/geom/Point";

import { MonsterBase } from "../MonsterBase";
import { BanditoAOEDamageSpin } from "../../components/abilities/BanditoAOEDamageSpin";
import { Targeting } from "../../../../Targeting";
import { CreepBase } from "./CreepBase";

import { BFOUNDATION } from "../../../../BFOUNDATION";

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
            let flags = Targeting.k_TARGETS_GROUND;
            flags |= friendly ? Targeting.k_TARGETS_ATTACKERS : Targeting.k_TARGETS_DEFENDERS;
            this.addComponent(new BanditoAOEDamageSpin(60, flags, 60, false));
        }
    }
}
