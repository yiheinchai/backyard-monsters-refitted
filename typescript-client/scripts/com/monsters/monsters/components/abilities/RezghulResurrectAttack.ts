import Point from "openfl/geom/Point";

import { ProjectileEvent } from "../../../events/ProjectileEvent";
import { ITargetable } from "../../../interfaces/ITargetable";
import { CreepBase } from "../../creeps/CreepBase";
import { Projectilev2 } from "../../../projectiles/Projectilev2";
import { RangedAttack } from "./RangedAttack";
import { Zombiefy } from "./Zombiefy";

import { TweenLite } from "gs/TweenLite";
import { Sine } from "gs/easing/Sine";

// Lazy imports to break circular dependency chains
function getMonsterBase(): any { return require("../../MonsterBase").MonsterBase; }
function getTargeting(): any { return require("../../../../../Targeting").Targeting; }
function getMAP(): any { return require("../../../../../MAP").MAP; }
function getCREATURES(): any { return require("../../../../../CREATURES").CREATURES; }
function getCREEPS(): any { return require("../../../../../CREEPS").CREEPS; }
function getEFFECTS(): any { return require("../../../../../EFFECTS").EFFECTS; }
function getGIBLETS(): any { return require("../../../../../GIBLETS").GIBLETS; }


/**
 * Rezghul resurrect attack - ranged attack that resurrects dead creatures.
 */
export class RezghulResurrectAttack extends RangedAttack {
    private static readonly k_UNRESURRECTABLE_CREATURES: Array<string> = ["C16", "C15", "C19", "C18"];

    private m_zombiefy: Zombiefy;
    private m_resurrectRange: number;

    constructor(projRange: number, rechargeTime: number, targetFlags: number, resAreaRange: number, proj: Projectilev2, zombieComponent: Zombiefy) {
        super(projRange, rechargeTime, targetFlags, proj);
        this.m_zombiefy = zombieComponent;
        this.m_resurrectRange = resAreaRange;
    }

    protected override getValidTargetsInRange(range: number, position: Point, targetFlags: number): Array<ITargetable> | null {
        if (!this.owner.inBattleState) {
            return null;
        }
        let targets: Array<ITargetable> | null = null;
        const allDeadCreeps: Array<any> = getTargeting().getDeadCreeps(position, range, targetFlags);
        for (let i = 0; i < allDeadCreeps.length; i++) {
            if (!targets) {
                targets = [];
            }
            const currentCreep: ITargetable = allDeadCreeps[i].creep;
            if (currentCreep instanceof CreepBase && RezghulResurrectAttack.k_UNRESURRECTABLE_CREATURES.indexOf((currentCreep as unknown as CreepBase)._creatureID) === -1) {
                targets.push(currentCreep);
            }
        }
        return targets;
    }

    protected override fireAt(target: ITargetable): Projectilev2 {
        const proj: Projectilev2 = super.fireAt(target);
        proj.addEventListener(ProjectileEvent.k_hit, this.onProjectileHit.bind(this), false, 0, true);
        return proj;
    }

    protected onProjectileHit(event: ProjectileEvent): void {
        const proj: Projectilev2 = event.target as Projectilev2;
        proj.removeEventListener(ProjectileEvent.k_hit, this.onProjectileHit.bind(this));
        this.resurrectAlliesInArea(proj);
    }

    private resurrectAlliesInArea(proj: Projectilev2): void {
        const deadCreepsInRange: Array<ITargetable> | null = this.getValidTargetsInRange(this.m_resurrectRange, new Point(proj.x, proj.y), this.m_targetFlags);
        if (deadCreepsInRange) {
            for (let i = 0; i < deadCreepsInRange.length; i++) {
                const currentCreep: ITargetable = deadCreepsInRange[i];
                if (currentCreep instanceof CreepBase && RezghulResurrectAttack.k_UNRESURRECTABLE_CREATURES.indexOf((currentCreep as unknown as CreepBase)._creatureID) === -1) {
                    this.resurrect(currentCreep as unknown as CreepBase);
                }
            }
        }
    }

    private resurrect(monsterToRes: CreepBase): void {
        let newMonster: CreepBase;
        if (this.owner._friendly) {
            newMonster = getCREATURES().Spawn(monsterToRes._creatureID, getMAP()._BUILDINGTOPS, monsterToRes._behaviour, new Point(monsterToRes.x, monsterToRes.y), monsterToRes._targetRotation, null, monsterToRes._house) as CreepBase;
        } else {
            newMonster = getCREEPS().Spawn(monsterToRes._creatureID, getMAP()._BUILDINGTOPS, monsterToRes._behaviour, new Point(monsterToRes.x, monsterToRes.y), monsterToRes._targetRotation, 1, false, true) as CreepBase;
        }
        getEFFECTS().Dig(Math.floor(newMonster.x), Math.floor(newMonster.y + 20));
        TweenLite.from(newMonster._graphicMC, 0.8, {
            "y": newMonster._graphicMC.y + 20,
            "ease": Sine.easeOut,
            "overwrite": false,
            "onComplete": newMonster._friendly ? newMonster.findDefenseTargets : newMonster.findTarget
        });
        getGIBLETS().Create(new Point(newMonster.x, newMonster.y + 20), 1, 50, 20, 10);
        newMonster.addComponent(this.m_zombiefy.clone());
        monsterToRes.corpseDeath();
    }
}
