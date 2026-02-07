import { SecNum } from './com/cc/utils/SecNum';
import { IAttackable } from './com/monsters/interfaces/IAttackable';
import Bitmap from 'openfl/display/Bitmap';
import BitmapData from 'openfl/display/BitmapData';
import MovieClip from 'openfl/display/MovieClip';
import MouseEvent from 'openfl/events/MouseEvent';
import Point from 'openfl/geom/Point';
import Rectangle from 'openfl/geom/Rectangle';
import { BTOWER } from './BTOWER';

// Lazy imports to break circular dependency chains
function getVacuum(): any { return require("./com/monsters/siege/weapons/Vacuum").Vacuum; }
function getATTACK(): any { return require("./ATTACK").ATTACK; }
function getBASE(): any { return require("./BASE").BASE; }
function getEFFECTS(): any { return require("./EFFECTS").EFFECTS; }
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getKEYS(): any { return require("./KEYS").KEYS; }
function getPOPUPS(): any { return require("./POPUPS").POPUPS; }
function getSOUNDS(): any { return require("./SOUNDS").SOUNDS; }


/**
 * BUILDING23 - Laser Tower
 * Extends BTOWER for laser defense tower
 */
export class BUILDING23 extends BTOWER {
    public static readonly TYPE: number = 23;
    public _animMC: MovieClip | null = null;
    public _animFrame: number = 0;
    public _field: BitmapData | null = null;
    public _fieldBMP: Bitmap | null = null;
    public _animBitmap: BitmapData | null = null;
    public _blend: number = 0;
    public _blending: boolean = false;
    public _bank: SecNum | null = null;

    constructor() {
        super();
        this._type = 23;
        this._frameNumber = 0;
        this._footprint = [new Rectangle(0, 0, 70, 70)];
        this._gridCost = [[new Rectangle(0, 0, 70, 70), 10], [new Rectangle(10, 10, 50, 50), 200]];
        this._spoutPoint = new Point(0, 0);
        this._spoutHeight = 30;
        this._top = -30;
        this.SetProps();
    }

    public override Fire(target: IAttackable): void {
        super.Fire(target);
        getSOUNDS().Play("laser", !this.isJard ? 0.8 : 0.4);
        const healthRatio: number = 0.5 + 0.5 / this.maxHealth * this.health;
        let overdrive: number = 1;
        if (getGLOBAL()._towerOverdrive && getGLOBAL()._towerOverdrive.Get() >= getGLOBAL().Timestamp()) {
            overdrive = 1.25;
        }
        if (this.isJard) {
            this._jarHealth!.Add(-Math.floor(this.damage * 25 * healthRatio * overdrive));
            getATTACK().Damage(this._mc!.x, this._mc!.y + this._top, this.damage * 25 * healthRatio * overdrive);
            if (this._jarHealth!.Get() <= 0) {
                this.KillJar();
            }
        } else if (this._targetVacuum) {
            getEFFECTS().Laser(this.x, this.y + 35, getGLOBAL().townHall.x, getGLOBAL().townHall.y - getGLOBAL().townHall._mc!.height * 2, 60, Math.floor(this.damage * 25 * healthRatio * overdrive), 0);
            getATTACK().Damage(this._mc!.x, this._mc!.y + this._top, this.damage * 25 * healthRatio * overdrive);
            getVacuum().getHose().modifyHealth(-Math.floor(this.damage * 25 * healthRatio * overdrive));
        } else {
            getEFFECTS().Laser(this.x, this.y + 35, target.x, target.y, 60, Math.floor(this.damage * healthRatio * overdrive), this._splash, this.Track.bind(this));
        }
    }

    public Track(angle: number): void {
        if (angle < 0) {
            angle = 360 + angle;
        }
        angle /= 6.66;
        this._animTick = angle;
        this.AnimFrame();
    }

    public override AnimFrame(advance: boolean = true): void {
        if (this._animLoaded && !getGLOBAL()._catchup) {
            this._animRect!.x = this._animRect!.width * this._animTick;
            this._animContainerBMD!.copyPixels(this._animBMD!, this._animRect!, this._nullPoint!);
        }
        ++this._frameNumber;
    }

    public override Constructed(): void {
        super.Constructed();
    }
}
