import Point from "openfl/geom/Point";

import { MonsterBase } from "../../MonsterBase";
import { AOEDamageOnAttackOncePerTarget } from "../../components/abilities/AOEDamageOnAttackOncePerTarget";
import { Targeting } from "../../Targeting";
import { CreepBase } from "./CreepBase";

import { BFOUNDATION } from "../../../../../BFOUNDATION";

/**
 * Wormzer - creep with AOE damage on attack when powered up.
 */
export class Wormzer extends CreepBase {
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
            let targetFlags = Targeting.k_TARGETS_BUILDINGS | Targeting.k_TARGETS_GROUND;
            if (ownedByAttacker) {
                targetFlags |= Targeting.k_TARGETS_ATTACKERS;
            } else {
                targetFlags |= Targeting.k_TARGETS_DEFENDERS;
            }
            this.addComponent(new AOEDamageOnAttackOncePerTarget(100, targetFlags, this.powerUpLevel()));
        }
    }
}
