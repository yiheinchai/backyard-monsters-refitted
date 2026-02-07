import Event from "openfl/events/Event";
import Point from "openfl/geom/Point";

import { Component } from "../Component";
import { CreepBase } from "../../creeps/CreepBase";

// Lazy imports to break circular dependency chains
function getMonsterBase(): any { return require("../../MonsterBase").MonsterBase; }
function getCREATURES(): any { return require("../../../../../CREATURES").CREATURES; }
function getCREEPS(): any { return require("../../../../../CREEPS").CREEPS; }
function getMAP(): any { return require("../../../../../MAP").MAP; }



/**
 * Death split - spawns multiple smaller creatures on death.
 */
export class DeathSplit extends Component {
    private _target: MonsterBase;
    private _splitType: string;

    constructor(target: MonsterBase, splitType: string) {
        super();
        this._target = target;
        this._target.addEventListener(getMonsterBase().k_DEATH_EVENT, this.split.bind(this));
        this._splitType = splitType;
    }

    protected split(event: Event | null = null): void {
        this._target.removeEventListener(getMonsterBase().k_DEATH_EVENT, this.split.bind(this));

        if (this._target._friendly && this._target._house) {
            return;
        }

        const splitCount: number = getCREATURES().GetProperty(this._target._creatureID, "splits", 0, this._target._friendly);
        let spawnPoint: Point = new Point(
            this._target._mc.x + Math.random() * 120 - 60,
            this._target._mc.y + Math.random() * 120 - 60
        );

        for (let i = 0; i < splitCount; i++) {
            let behaviour: string = "bounce";
            if (this._target._behaviour === getMonsterBase().k_sBHVR_DEFEND) {
                behaviour = "defend";
            }

            let spawnedMonster: MonsterBase;
            if (this._target._friendly) {
                spawnedMonster = getCREATURES().Spawn(this._splitType, getMAP()._BUILDINGTOPS, behaviour, spawnPoint, Math.random() * 360);
                spawnedMonster.isDisposable = true;
            } else {
                spawnedMonster = getCREEPS().Spawn(this._splitType, getMAP()._BUILDINGTOPS, behaviour, spawnPoint, Math.random() * 360, 1, false, true);
            }

            spawnPoint = new Point(
                this._target._mc.x + Math.random() * 120 - 60,
                this._target._mc.y + Math.random() * 120 - 60
            );

            if (this._target._behaviour === getMonsterBase().k_sBHVR_DEFEND) {
                (spawnedMonster as CreepBase).changeModeDefend();
            }
        }
    }
}
