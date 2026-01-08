import { Point } from "openfl/geom/Point";

import { ITargetable } from "../../interfaces/ITargetable";
import { MonsterBase } from "../../MonsterBase";
import { DAVERockets } from "../../components/abilities/DAVERockets";
import { CreepBase } from "./CreepBase";

import { BFOUNDATION } from "../../../../../BFOUNDATION";
import { FIREBALLS } from "../../../../../FIREBALLS";
import { FIREBALL } from "../../../../../FIREBALL";
import { SOUNDS } from "../../../../../SOUNDS";

/**
 * DAVE - flying creep with dual rocket attacks.
 */
export class DAVE extends CreepBase {
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
            this.addComponent(new DAVERockets());
        }
    }

    protected override rangedAttack(target: ITargetable): ITargetable {
        if (target instanceof BFOUNDATION) {
            FIREBALLS.Spawn(
                new Point(this._tmpPoint.x + Math.random() * 20 - 10, this._tmpPoint.y + Math.random() * 20 - 10),
                this._targetBuilding._position,
                this._targetBuilding,
                10,
                this.damage / 2,
                0,
                0,
                FIREBALL.TYPE_MISSILE,
                this
            );
            return FIREBALLS.Spawn(
                new Point(this._tmpPoint.x + Math.random() * 20 - 10, this._tmpPoint.y + Math.random() * 20 - 10),
                this._targetBuilding._position,
                this._targetBuilding,
                10,
                this.damage / 2,
                0,
                0,
                FIREBALL.TYPE_MISSILE,
                this
            );
        }
        FIREBALLS.Spawn2(
            new Point(this._tmpPoint.x + Math.random() * 20 - 10, this._tmpPoint.y + Math.random() * 20 - 10),
            this._targetCreep._tmpPoint,
            this._targetCreep,
            10,
            this.damage / 2,
            0,
            FIREBALL.TYPE_MISSILE,
            1,
            this
        );
        return FIREBALLS.Spawn2(
            new Point(this._tmpPoint.x + Math.random() * 20 - 10, this._tmpPoint.y + Math.random() * 20 - 10),
            this._targetCreep._tmpPoint,
            this._targetCreep,
            10,
            this.damage / 2,
            0,
            FIREBALL.TYPE_MISSILE,
            1,
            this
        );
    }

    public override deathSplat(): void {
        SOUNDS.Play("monsterlanddave");
    }
}
