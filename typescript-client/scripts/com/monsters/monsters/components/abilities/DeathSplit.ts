import Event from "openfl/events/Event";
import Point from "openfl/geom/Point";

import { MonsterBase } from "../../MonsterBase";
import { Component } from "../Component";
import { CreepBase } from "../../creeps/CreepBase";

import { CREATURES } from "../../../../../CREATURES";
import { CREEPS } from "../../../../../CREEPS";
import { MAP } from "../../../../../MAP";

/**
 * Death split - spawns multiple smaller creatures on death.
 */
export class DeathSplit extends Component {
    private _target: MonsterBase;
    private _splitType: string;

    constructor(target: MonsterBase, splitType: string) {
        super();
        this._target = target;
        this._target.addEventListener(MonsterBase.k_DEATH_EVENT, this.split.bind(this));
        this._splitType = splitType;
    }

    protected split(event: Event | null = null): void {
        this._target.removeEventListener(MonsterBase.k_DEATH_EVENT, this.split.bind(this));

        if (this._target._friendly && this._target._house) {
            return;
        }

        const splitCount: number = CREATURES.GetProperty(this._target._creatureID, "splits", 0, this._target._friendly);
        let spawnPoint: Point = new Point(
            this._target._mc.x + Math.random() * 120 - 60,
            this._target._mc.y + Math.random() * 120 - 60
        );

        for (let i = 0; i < splitCount; i++) {
            let behaviour: string = "bounce";
            if (this._target._behaviour === MonsterBase.k_sBHVR_DEFEND) {
                behaviour = "defend";
            }

            let spawnedMonster: MonsterBase;
            if (this._target._friendly) {
                spawnedMonster = CREATURES.Spawn(this._splitType, MAP._BUILDINGTOPS, behaviour, spawnPoint, Math.random() * 360);
                spawnedMonster.isDisposable = true;
            } else {
                spawnedMonster = CREEPS.Spawn(this._splitType, MAP._BUILDINGTOPS, behaviour, spawnPoint, Math.random() * 360, 1, false, true);
            }

            spawnPoint = new Point(
                this._target._mc.x + Math.random() * 120 - 60,
                this._target._mc.y + Math.random() * 120 - 60
            );

            if (this._target._behaviour === MonsterBase.k_sBHVR_DEFEND) {
                (spawnedMonster as CreepBase).changeModeDefend();
            }
        }
    }
}
