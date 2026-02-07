import BitmapData from 'openfl/display/BitmapData';
import Point from 'openfl/geom/Point';
import Rectangle from 'openfl/geom/Rectangle';
import { IAttackable } from './com/monsters/interfaces/IAttackable';
import { BTOWER } from './BTOWER';
import { PROJECTILES } from './PROJECTILES';

// Lazy imports to break circular dependency chains
function getATTACK(): any { return require("./ATTACK").ATTACK; }
function getBASE(): any { return require("./BASE").BASE; }
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getSOUNDS(): any { return require("./SOUNDS").SOUNDS; }


/**
 * BUILDING21 - Sniper Tower
 * Extends BTOWER for sniper defense tower
 */
export class BUILDING21 extends BTOWER {
    public _animBitmap: BitmapData | null = null;

    constructor() {
        super();
        this._frameNumber = 0;
        this._type = 21;
        this._top = getBASE().isInfernoMainYardOrOutpost ? -60 : -30;
        this._footprint = [new Rectangle(0, 0, 70, 70)];
        this._gridCost = [[new Rectangle(0, 0, 70, 70), 10], [new Rectangle(10, 10, 50, 50), 200]];
        this.SetProps();
        this.Props();
    }

    public override TickAttack(): void {
        super.TickAttack();
        this.Rotate();
    }

    public override AnimFrame(advance: boolean = true): void {
        if (this._animLoaded && getGLOBAL()._render) {
            this._animRect!.x = this._animRect!.width * this._animTick;
            this._animContainerBMD!.copyPixels(this._animBMD!, this._animRect!, this._nullPoint!);
        }
    }

    public override Fire(target: IAttackable): void {
        super.Fire(target);
        if (getBASE().isInfernoMainYardOrOutpost) {
            getSOUNDS().Play("isniper", !this.isJard ? 0.8 : 0.4);
        } else {
            getSOUNDS().Play("snipe1", !this.isJard ? 0.8 : 0.4);
        }
        const healthRatio: number = 0.5 + 0.5 / this.maxHealth * this.health;
        let overdrive: number = 1;
        if (getGLOBAL()._towerOverdrive && getGLOBAL()._towerOverdrive.Get() >= getGLOBAL().Timestamp()) {
            overdrive = 1.25;
        }
        if (this.isJard) {
            this._jarHealth!.Add(-Math.floor(this.damage * healthRatio * overdrive));
            getATTACK().Damage(this._mc!.x, this._mc!.y + this._top, this.damage * healthRatio * overdrive);
            if (this._jarHealth!.Get() <= 0) {
                this.KillJar();
            }
        } else {
            PROJECTILES.Spawn(new Point(this._mc!.x, this._mc!.y + this._top), null, target, this._speed, Math.floor(this.damage * healthRatio * overdrive), false, this._splash);
        }
    }

    public override Props(): void {
        super.Props();
    }

    public override Upgraded(): void {
        super.Upgraded();
    }

    public override Constructed(): void {
        super.Constructed();
    }
}
