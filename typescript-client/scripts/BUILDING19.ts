import { SecNum } from './com/cc/utils/SecNum';
import Bitmap from 'openfl/display/Bitmap';
import BitmapData from 'openfl/display/BitmapData';
import MovieClip from 'openfl/display/MovieClip';
import Event from 'openfl/events/Event';
import MouseEvent from 'openfl/events/MouseEvent';
import Point from 'openfl/geom/Point';
import Rectangle from 'openfl/geom/Rectangle';
import { BFOUNDATION } from './BFOUNDATION';
import { MONSTERBAITER } from './MONSTERBAITER';

// Lazy imports to break circular dependency chains
function getBASE(): any { return require("./BASE").BASE; }
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getKEYS(): any { return require("./KEYS").KEYS; }
function getPOPUPS(): any { return require("./POPUPS").POPUPS; }
function getSOUNDS(): any { return require("./SOUNDS").SOUNDS; }


/**
 * BUILDING19 - Monster Baiter
 * Extends BFOUNDATION for the monster baiter trap/lure building
 */
export class BUILDING19 extends BFOUNDATION {
    public _animMC: MovieClip | null = null;
    public _animFrame: number = 0;
    public _field: BitmapData | null = null;
    public _fieldBMP: Bitmap | null = null;
    public _frameNumber: number = 0;
    public _animBitmap: BitmapData | null = null;
    public _blend: number = 0;
    public _blending: boolean = false;
    public _bank: SecNum | null = null;

    constructor() {
        super();
        this._type = 19;
        this._frameNumber = 0;
        this._footprint = [new Rectangle(0, 0, 80, 80)];
        this._gridCost = [[new Rectangle(0, 0, 80, 80), 50]];
        this._spoutPoint = new Point(0, 0);
        this._spoutHeight = 40;
        this.SetProps();
    }

    public override TickFast(event: Event | null = null): void {
        if (!getGLOBAL()._catchup) {
            if (this._animTick === 0 && MONSTERBAITER._attacking === 1 && this.health > 0) {
                getSOUNDS().Play("wmbstart");
                this._animTick = 1;
            }
            if (this._animTick > 0 && this._frameNumber % 2 === 0) {
                if (this._animTick > 40) {
                    if (MONSTERBAITER._attacking === 1 && this.health > 0) {
                        this._animTick = 1;
                    } else {
                        this._animTick = 0;
                    }
                }
                this.AnimFrame(false);
                if (this._animTick > 0) {
                    ++this._animTick;
                }
            }
            ++this._frameNumber;
        } else {
            this._animTick = 0;
        }
    }

    public override Description(): void {
        super.Description();
        this._upgradeDescription = getKEYS().Get("building_baiter_upgrade_desc");
    }

    public override Update(force: boolean = false): void {
        super.Update(force);
    }

    public override Constructed(): void {
        super.Constructed();
        getGLOBAL()._bBaiter = this;
        if (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.BUILD && getBASE().isMainYard) {
            MONSTERBAITER.Update();
            MONSTERBAITER.Fill();
        }
    }

    public override Upgraded(): void {
        super.Upgraded();
        if (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.BUILD) {
            MONSTERBAITER.Update();
        }
    }

    public override RecycleC(): void {
        getGLOBAL()._bBaiter = null;
        super.RecycleC();
    }

    public override Setup(building: any): void {
        super.Setup(building);
        if (this._countdownBuild.Get() === 0) {
            getGLOBAL()._bBaiter = this;
        }
    }

    public override Export(): any {
        return super.Export();
    }
}
