import Point from "openfl/geom/Point";

import { IAttackable } from "../../../interfaces/IAttackable";
import { Component } from "../Component";

// Lazy imports to break circular dependency chains
function getMonsterBase(): any { return require("../../MonsterBase").MonsterBase; }
function getTargeting(): any { return require("../../../../../Targeting").Targeting; }
function getBFOUNDATION(): any { return require("../../../../../BFOUNDATION").BFOUNDATION; }



/**
 * AOE damage - deals area of effect damage to targets in range.
 */
export class AOEDamage extends Component {
    protected m_radiusInner: number;
    protected m_radiusOuter: number;
    protected m_maxTargets: number;
    protected m_targetFlags: number;
    protected m_includeInitialTarget: boolean;

    constructor(radiusOuter: number, targetFlags: number, maxTargets: number = 4294967295, radiusInner: number = 0, includeInitialTarget: boolean = true) {
        super();
        this.m_radiusOuter = radiusOuter;
        this.m_radiusInner = radiusInner;
        this.m_maxTargets = maxTargets;
        this.m_targetFlags = targetFlags;
        this.m_includeInitialTarget = includeInitialTarget;
    }

    protected dealAOEDamage(damage: number, initialTarget: IAttackable | null = null): void {
        const ownerLocation: Point = new Point(this.owner.x, this.owner.y);
        const allTargets: Array<any> = this.getAllTargets(ownerLocation, initialTarget);
        if (allTargets.length <= 0) {
            return;
        }
        allTargets.sort((a: any, b: any) => a.dist - b.dist);
        if (allTargets.length > this.m_maxTargets) {
            allTargets.length = this.m_maxTargets;
        }
        getTargeting().DealLinearAEDamage(ownerLocation, this.m_radiusOuter, Math.abs(damage), allTargets, this.m_radiusInner);
    }

    private getAllTargets(ownerLocation: Point, initialTarget: IAttackable | null = null): Array<any> {
        let targetFlags: number = this.m_targetFlags;
        let ignoreCreep: MonsterBase | null = null;
        let ignoreBuilding: BFOUNDATION | null = null;
        if (this.owner._friendly && Boolean(targetFlags & getTargeting().k_TARGETS_BUILDINGS) && !(initialTarget instanceof getBFOUNDATION())) {
            // Defending monsters will not hit their own base's buildings unless specifically targetting them.
            targetFlags ^= getTargeting().k_TARGETS_BUILDINGS;
        }
        if (!this.m_includeInitialTarget) {
            if (initialTarget instanceof getMonsterBase()) {
                ignoreCreep = initialTarget;
            } else if (initialTarget instanceof getBFOUNDATION()) {
                ignoreBuilding = initialTarget;
            }
        }
        return getTargeting().getTargetsInRange(this.m_radiusOuter, ownerLocation, targetFlags, ignoreCreep, ignoreBuilding);
    }
}
