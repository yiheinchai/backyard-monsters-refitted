import Point from "openfl/geom/Point";

import { IAttackable } from "../../../interfaces/IAttackable";
import { ITargetable } from "../../../interfaces/ITargetable";
import { AOEDamageOnDeath } from "../../components/abilities/AOEDamageOnDeath";
import { AcidOnDeath } from "../../components/abilities/AcidOnDeath";
import { AdditionPropertyModifier } from "../../components/modifiers/AdditionPropertyModifier";
import { CreepBase } from "../CreepBase";

// Lazy imports to break circular dependency chains
function getMonsterBase(): any { return require("../../MonsterBase").MonsterBase; }
function getTargeting(): any { return require("../../../../../Targeting").Targeting; }
function getBFOUNDATION(): any { return require("../../../../../BFOUNDATION").BFOUNDATION; }



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
        let targetFlags = getTargeting().k_TARGETS_BUILDINGS | getTargeting().k_TARGETS_GROUND;
        if (ownedByAttacker) {
            targetFlags |= getTargeting().k_TARGETS_ATTACKERS;
        } else {
            targetFlags |= getTargeting().k_TARGETS_DEFENDERS;
        }
        this.m_damageComponent = this.addComponent(new AOEDamageOnDeath(60, targetFlags)) as unknown as AOEDamageOnDeath;
        this.m_acidComponent = this.addComponent(new AcidOnDeath(60, 100, 10)) as unknown as AcidOnDeath;
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
