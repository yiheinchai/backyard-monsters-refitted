import Point from "openfl/geom/Point";

import { MonsterBase } from "../../../MonsterBase";
import { AOEDamageOnAttackOncePerTarget } from "../../../components/abilities/AOEDamageOnAttackOncePerTarget";
import { Targeting } from "../../../Targeting";
import { CreepBase } from "../CreepBase";

import { BFOUNDATION } from "../../../../../../BFOUNDATION";

/**
 * King Wormzer - inferno creep with AOE damage on attack (buildings only).
 * Monster targeting parameters disabled - King Wormzer's splash damage did not work against
 * monsters in the original game and is too overpowered when re-enabled.
 */
export class KingWormzer extends CreepBase {
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
        
        const targetFlags = Targeting.k_TARGETS_BUILDINGS | Targeting.k_TARGETS_GROUND;
        // Monster targeting parameters disabled.
        // King Wormer's splash damage did not work against monsters in the original game, and is too overpowered when re-enabled.
        //if(ownedByAttacker) {
        //   targetFlags |= Targeting.k_TARGETS_ATTACKERS;
        //} else {
        //   targetFlags |= Targeting.k_TARGETS_DEFENDERS;
        //}
        this.addComponent(new AOEDamageOnAttackOncePerTarget(100, targetFlags, 4));
    }
}
