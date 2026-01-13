import Point from "openfl/geom/Point";

import { IAttackable } from "../../../interfaces/IAttackable";
import { ITargetable } from "../../../interfaces/ITargetable";
import { MonsterBase } from "../../MonsterBase";
import { Targeting } from "../../../../../Targeting";
import { AOEDamageOnDeath } from "../../components/abilities/AOEDamageOnDeath";
import { AcidOnDeath } from "../../components/abilities/AcidOnDeath";
import { AdditionPropertyModifier } from "../../components/modifiers/AdditionPropertyModifier";
import { CreepBase } from "../CreepBase";

import { BFOUNDATION } from "../../../../../BFOUNDATION";

/**
 * Project X v2 - rebalanced creep with AOE damage and acid on death.
 */
export class ProjectXv2 extends CreepBase {
    private m_damageComponent: AOEDamageOnDeath;
    private m_acidComponent: AcidOnDeath;
    private m_lastingDamageModifier: AdditionPropertyModifier;

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
        let targetFlags = Targeting.k_TARGETS_BUILDINGS | Targeting.k_TARGETS_GROUND;
        if (ownedByAttacker) {
            targetFlags |= Targeting.k_TARGETS_ATTACKERS;
        } else {
            targetFlags |= Targeting.k_TARGETS_DEFENDERS;
        }
        this.m_damageComponent = this.addComponent(new AOEDamageOnDeath(60, targetFlags)) as AOEDamageOnDeath;
        this.m_acidComponent = this.addComponent(new AcidOnDeath(60, 100, 10)) as AcidOnDeath;
        this.m_lastingDamageModifier = new AdditionPropertyModifier();
        this.damageProperty.addModifier(this.m_lastingDamageModifier);
    }

    protected override attacked(target: IAttackable, damage: number, source: ITargetable | null = null): void {
        ++this.m_lastingDamageModifier.value;
        super.attacked(target, damage, source);
    }

    public override die(): void {
        super.die();
    }
}
