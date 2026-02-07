import Bitmap from 'openfl/display/Bitmap';
import BitmapData from 'openfl/display/BitmapData';
import MovieClip from 'openfl/display/MovieClip';
import Event from 'openfl/events/Event';
import MouseEvent from 'openfl/events/MouseEvent';
import Rectangle from 'openfl/geom/Rectangle';
import { BFOUNDATION } from './BFOUNDATION';

// Lazy imports to break circular dependency chains
function getBASE(): any { return require("./BASE").BASE; }
function getCREATURELOCKER(): any { return require("./CREATURELOCKER").CREATURELOCKER; }
function getCREEPS(): any { return require("./CREEPS").CREEPS; }
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getKEYS(): any { return require("./KEYS").KEYS; }
function getPOPUPS(): any { return require("./POPUPS").POPUPS; }


/**
 * BUILDING8 - Monster Locker
 * Extends BFOUNDATION for creature unlocking building
 */
export class BUILDING8 extends BFOUNDATION {
    public _animMC: MovieClip | null = null;
    public _field: BitmapData | null = null;
    public _fieldBMP: Bitmap | null = null;
    public _frameNumber: number = 0;
    public _animBitmap: BitmapData | null = null;

    constructor() {
        super();
        this._frameNumber = Math.floor(Math.random() * 5);
        this._type = 8;
        this._footprint = [new Rectangle(0, 0, 100, 100)];
        this._gridCost = [[new Rectangle(0, 0, 100, 100), 10], [new Rectangle(10, 10, 80, 80), 200]];
        this.SetProps();
    }

    public override TickFast(event: Event | null = null): void {
        super.TickFast(event);
        if (getGLOBAL()._render && this._countdownBuild.Get() + this._countdownUpgrade.Get() === 0 && getCREATURELOCKER()._unlocking !== null) {
            if ((getGLOBAL().mode === getGLOBAL().e_BASE_MODE.BUILD || getGLOBAL().mode === "help" || getGLOBAL().mode === "view") && 
                this._frameNumber % 3 === 0 && getCREEPS()._creepCount === 0) {
                this.AnimFrame();
            } else if (this._frameNumber % 10 === 0) {
                this.AnimFrame();
            }
        }
        ++this._frameNumber;
    }

    public override Description(): void {
        super.Description();
        if (getGLOBAL()._lockerOverdrive > 0) {
            this._buildingTitle += ` <font color="#CC0000">${getKEYS().Get("cloc_overdrive", { v1: getGLOBAL().ToTime(getGLOBAL()._lockerOverdrive) })}</font>`;
        }
        if (getCREATURELOCKER()._unlocking !== null && getCREATURELOCKER()._lockerData[getCREATURELOCKER()._unlocking]) {
            this._specialDescription = `Unlocking the ${getCREATURELOCKER()._creatures[getCREATURELOCKER()._unlocking].name} ${getGLOBAL().ToTime(getCREATURELOCKER()._lockerData[getCREATURELOCKER()._unlocking].e - getGLOBAL().Timestamp())} remaining<br>`;
        }
    }

    public override Constructed(): void {
        super.Constructed();
        getGLOBAL()._bLocker = this;
    }

    public override Upgraded(): void {
        super.Upgraded();
    }

    public override Cancel(): void {
        getGLOBAL()._bLocker = null;
        super.Cancel();
    }

    public override Upgrade(): boolean {
        if (getCREATURELOCKER()._unlocking !== null) {
            getGLOBAL().Message(getKEYS().Get("cloc_err_cantupgrade", { v1: getKEYS().Get(getCREATURELOCKER()._creatures[getCREATURELOCKER()._unlocking].name) }));
            return false;
        }
        return super.Upgrade();
    }

    public override Recycle(): void {
        if (getCREATURELOCKER()._unlocking !== null) {
            getGLOBAL().Message(getKEYS().Get("cloc_err_cantrecycle", { v1: getCREATURELOCKER()._creatures[getCREATURELOCKER()._unlocking].name }), getKEYS().Get("msg_recyclebuilding_btn"), this.RecycleB);
        } else {
            super.Recycle();
        }
    }

    public override RecycleB(event: MouseEvent | null = null): void {
        if (getCREATURELOCKER()._unlocking !== null) {
            getCREATURELOCKER().Cancel();
        }
        super.RecycleB(event);
    }

    public override RecycleC(): void {
        getGLOBAL()._bLocker = null;
        super.RecycleC();
    }

    public override Setup(building: any): void {
        super.Setup(building);
        if (this._countdownBuild.Get() === 0) {
            getGLOBAL()._bLocker = this;
        }
    }
}
