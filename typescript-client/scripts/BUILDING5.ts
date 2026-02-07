import MovieClip from 'openfl/display/MovieClip';
import MouseEvent from 'openfl/events/MouseEvent';
import Rectangle from 'openfl/geom/Rectangle';
import { BFOUNDATION } from './BFOUNDATION';

// Lazy imports to break circular dependency chains
function getBASE(): any { return require("./BASE").BASE; }
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getKEYS(): any { return require("./KEYS").KEYS; }
function getPOPUPS(): any { return require("./POPUPS").POPUPS; }


/**
 * BUILDING5 - Monster Flinger
 * Extends BFOUNDATION for the monster flinger siege weapon
 */
export class BUILDING5 extends BFOUNDATION {
    constructor() {
        super();
        this._type = 5;
        this._footprint = [new Rectangle(0, 0, 90, 90)];
        this._gridCost = [[new Rectangle(0, 0, 90, 90), 10], [new Rectangle(10, 10, 70, 70), 200]];
        this.SetProps();
    }

    public static getFlingerRange(level: number, isInferno: boolean): number {
        return isInferno ? 2 + 2 * level : level;
    }

    public override get tickLimit(): number {
        let limit: number = super.tickLimit;
        if (this._countdownBuild.Get() > 0) {
            limit = Math.min(limit, this._countdownBuild.Get());
        }
        if (this._countdownUpgrade.Get() > 0) {
            limit = Math.max(limit, this._countdownUpgrade.Get());
        }
        return limit;
    }

    public override Tick(seconds: number): void {
        this._canFunction = this._countdownBuild.Get() <= 0 && this.health >= this.maxHealth * 0.5;
        super.Tick(seconds);
    }

    public Fund(): void {
        // Empty method
    }

    public override PlaceB(): void {
        getGLOBAL()._bFlinger = this;
        if (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.BUILD) {
            getGLOBAL()._playerFlingerLevel.Set(this._lvl.Get());
        }
        super.PlaceB();
    }

    public override Cancel(): void {
        getGLOBAL()._bFlinger = null;
        if (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.BUILD) {
            getGLOBAL()._playerFlingerLevel.Set(0);
        }
        super.Cancel();
    }

    public override RecycleC(): void {
        getGLOBAL()._bFlinger = null;
        if (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.BUILD) {
            getGLOBAL()._playerFlingerLevel.Set(0);
        }
        super.RecycleC();
    }

    public override Description(): void {
        super.Description();
        this._upgradeDescription = getKEYS().Get("building_flinger_upgrade_desc");
    }

    public override Update(force: boolean = false): void {
        super.Update(force);
    }

    public override Constructed(): void {
        super.Constructed();
        getGLOBAL()._bFlinger = this;
        if (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.BUILD) {
            getGLOBAL()._playerFlingerLevel.Set(this._lvl.Get());
        }
    }

    public override Upgraded(): void {
        super.Upgraded();
        if (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.BUILD && getBASE().isMainYard) {
            getGLOBAL()._playerFlingerLevel.Set(this._lvl.Get());
        }
    }

    public override Setup(building: any): void {
        super.Setup(building);
        if (this._countdownBuild.Get() <= 0) {
            if (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.BUILD) {
                getGLOBAL()._playerFlingerLevel.Set(this._lvl.Get());
            }
            getGLOBAL()._bFlinger = this;
        }
    }
}
