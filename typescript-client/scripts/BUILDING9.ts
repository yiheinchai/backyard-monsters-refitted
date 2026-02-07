import Bitmap from 'openfl/display/Bitmap';
import BitmapData from 'openfl/display/BitmapData';
import MovieClip from 'openfl/display/MovieClip';
import Event from 'openfl/events/Event';
import MouseEvent from 'openfl/events/MouseEvent';
import Point from 'openfl/geom/Point';
import Rectangle from 'openfl/geom/Rectangle';
import { BFOUNDATION } from './BFOUNDATION';
import { ACHIEVEMENTS } from './ACHIEVEMENTS';

// Lazy imports to break circular dependency chains
function getBASE(): any { return require("./BASE").BASE; }
function getCREATURES(): any { return require("./CREATURES").CREATURES; }
function getGIBLETS(): any { return require("./GIBLETS").GIBLETS; }
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getKEYS(): any { return require("./KEYS").KEYS; }
function getPOPUPS(): any { return require("./POPUPS").POPUPS; }
function getQUESTS(): any { return require("./QUESTS").QUESTS; }
function getResourcePackages(): any { return require("./ResourcePackages").ResourcePackages; }
function getSOUNDS(): any { return require("./SOUNDS").SOUNDS; }


/**
 * BUILDING9 - Monster Juicer
 * Extends BFOUNDATION for monster recycling building
 */
export class BUILDING9 extends BFOUNDATION {
    public static readonly TYPE: number = 9;
    
    public _animMC: MovieClip | null = null;
    public _field: BitmapData | null = null;
    public _fieldBMP: Bitmap | null = null;
    public _frameNumber: number = 0;
    public _animBitmap: BitmapData | null = null;
    public _blend: number = 0;
    public _blending: boolean = false;
    private _lastType: number = 0;
    public _guardian: number = 0;

    constructor() {
        super();
        this._frameNumber = 0;
        this._type = 9;
        this._blend = 0;
        this._footprint = [new Rectangle(0, 0, 80, 80)];
        this._gridCost = [[new Rectangle(0, 0, 80, 80), 50]];
        this._spoutPoint = new Point(0, 12);
        this._spoutHeight = 28;
        this.SetProps();
    }

    public Prep(creatureId: string): void {
        ++getQUESTS()._global.monstersblended;
        getQUESTS()._global.monstersblendedgoo += Math.ceil(getCREATURES().GetProperty(creatureId, "cResource") * 0.7);
        ACHIEVEMENTS.Check("monstersblended", getQUESTS()._global.monstersblended);
        getQUESTS().Check();
        if (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.BUILD) {
            getBASE().Save();
        }
    }

    public Blend(amount: number, creatureId: string, multiplier: number = 1): void {
        const isInfernoCreature: boolean = creatureId.substr(0, 2) === "IC";
        this._blend += amount;
        let conversionRate: number = 0.6;
        if (this._lvl.Get() === 2) {
            conversionRate = 0.8;
        } else if (this._lvl.Get() === 3) {
            conversionRate = 1;
        }
        this._guardian = 0;
        getBASE().Fund(4, Math.ceil(getCREATURES().GetProperty(creatureId, "cResource") * conversionRate * multiplier), false, null, creatureId.substr(0, 1) === "I" && !getBASE().isInfernoMainYardOrOutpost);
        this._lastType = isInfernoCreature ? 8 : 4;
        getResourcePackages().Create(this._lastType, this, Math.ceil(getCREATURES().GetProperty(creatureId, "cResource") * conversionRate));
    }

    public BlendGuardian(amount: number): void {
        this._blend += amount;
        this._guardian = 1;
    }

    public override TickFast(event: Event | null = null): void {
        super.TickFast(event);
        if (this._animLoaded && !getGLOBAL()._catchup && (this._blend > 0 || this._animTick > 2) && this._frameNumber % 2 === 0) {
            this.AnimFrame();
            if (this._animTick === 1) {
                getSOUNDS().Play("juice");
            }
            if (this._animTick === 15) {
                this._blend = 0;
                if (!this._guardian) {
                    getResourcePackages().Create(this._lastType, this, 1);
                }
            }
            if (this._animTick === 52) {
                this._animTick = 0;
            }
        }
        ++this._frameNumber;
    }

    public override AnimFrame(advance: boolean = true): void {
        if (this._animContainerBMD) {
            this._animContainerBMD.copyPixels(this._animBMD!, new Rectangle(60 * this._animTick, 0, 60, 39), new Point(0, 0));
        }
        ++this._animTick;
        let blendAmount: number = this._blend;
        if (blendAmount > 70) {
            blendAmount = 70;
        }
        if (this._lvl.Get() === 2) {
            blendAmount *= 1.2;
        } else if (this._lvl.Get() === 3) {
            blendAmount *= 1.4;
        }
        if (this._animTick === 15) {
            if (this._guardian === 0) {
                getGIBLETS().Create(this._spoutPoint.add(new Point(this._mc!.x, this._mc!.y)), 0.8, 100, blendAmount, this._spoutHeight);
            } else {
                getGIBLETS().Create(this._spoutPoint.add(new Point(this._mc!.x, this._mc!.y)), 2, 1000, blendAmount, this._spoutHeight);
            }
        }
    }

    public override Description(): void {
        super.Description();
        if (this._lvl.Get() === 1 && this._upgradeCosts !== "") {
            this._upgradeDescription = getKEYS().Get("building_juicer_conversion", { v1: 60, v2: 80 });
        } else if (this._lvl.Get() === 2 && this._upgradeCosts !== "") {
            this._upgradeDescription = getKEYS().Get("building_juicer_conversion", { v1: 80, v2: 100 });
        }
    }

    public override Constructed(): void {
        super.Constructed();
        getGLOBAL()._bJuicer = this;
    }

    public override Upgraded(): void {
        super.Upgraded();
    }

    public override RecycleC(): void {
        getGLOBAL()._bJuicer = null;
        super.RecycleC();
    }

    public override Setup(building: any): void {
        super.Setup(building);
        if (this._countdownBuild.Get() === 0) {
            getGLOBAL()._bJuicer = this;
        }
        if (building.tjc) {
            getQUESTS()._global.monstersblended = building.tjc;
        }
        if (building.tjg) {
            getQUESTS()._global.monstersblendedgoo = building.tjg;
        }
        this._animRandomStart = false;
        this._animTick = 2;
    }

    public override Export(): any {
        return super.Export();
    }
}
