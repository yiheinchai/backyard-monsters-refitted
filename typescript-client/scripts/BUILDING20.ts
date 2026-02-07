import BitmapData from 'openfl/display/BitmapData';
import Point from 'openfl/geom/Point';
import Rectangle from 'openfl/geom/Rectangle';
import { IAttackable } from './com/monsters/interfaces/IAttackable';
import { BTOWER } from './BTOWER';
import { PROJECTILES } from './PROJECTILES';

// Lazy imports to break circular dependency chains
function getATTACK(): any { return require("./ATTACK").ATTACK; }
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getSOUNDS(): any { return require("./SOUNDS").SOUNDS; }
function getTargeting(): any { return require("./Targeting").Targeting; }


/**
 * BUILDING20 - Cannon Tower
 * Extends BTOWER for cannon defense tower
 */
export class BUILDING20 extends BTOWER {
    public static readonly TYPE: number = 20;
    public _animBitmap: BitmapData | null = null;

    constructor() {
        super();
        this._frameNumber = 0;
        this._type = 20;
        this._top = -4;
        this._footprint = [new Rectangle(0, 0, 70, 70)];
        this._gridCost = [[new Rectangle(0, 0, 70, 70), 10], [new Rectangle(10, 10, 50, 50), 200]];
        this.SetProps();
        this.Props();
    }

    public override Fire(target: IAttackable): void {
        super.Fire(target);
        getSOUNDS().Play("splash1", !this.isJard ? 0.8 : 0.4);
        const healthRatio: number = 0.5 + 0.5 / this.maxHealth * this.health;
        let overdrive: number = 1;
        if (getGLOBAL()._towerOverdrive && getGLOBAL()._towerOverdrive.Get() >= getGLOBAL().Timestamp()) {
            overdrive = 1.25;
        }
        if (this.isJard) {
            this._jarHealth!.Add(-Math.floor(this.damage * 6 * healthRatio * overdrive));
            getATTACK().Damage(this._mc!.x, this._mc!.y + this._top, this.damage * 6 * healthRatio * overdrive);
            if (this._jarHealth!.Get() <= 0) {
                this.KillJar();
            }
        } else if (this._targetVacuum) {
            PROJECTILES.Spawn(
                new Point(this._mc!.x, this._mc!.y + this._top),
                getGLOBAL().townHall._position!.add(new Point(0, -getGLOBAL().townHall._mc!.height)),
                null, this._speed, Math.floor(this.damage * overdrive * 3 * healthRatio), false, 0
            );
        } else {
            PROJECTILES.Spawn(
                new Point(this._mc!.x, this._mc!.y + this._top),
                null, target, this._speed, Math.floor(this.damage * healthRatio * overdrive),
                false, this._splash, getTargeting().getOldStyleTargets(-1)
            );
        }
    }
}
