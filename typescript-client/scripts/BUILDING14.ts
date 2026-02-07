import MouseEvent from 'openfl/events/MouseEvent';
import Point from 'openfl/geom/Point';
import Rectangle from 'openfl/geom/Rectangle';
import { WMBASE } from './com/monsters/ai/WMBASE';
import { ICoreBuilding } from './com/monsters/interfaces/ICoreBuilding';
import { BSTORAGE } from './BSTORAGE';
import { ACHIEVEMENTS } from './ACHIEVEMENTS';

// Lazy imports to break circular dependency chains
function getMapRoomManager(): any { return require("./com/monsters/maproom_manager/MapRoomManager").MapRoomManager; }
function getBASE(): any { return require("./BASE").BASE; }
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getKEYS(): any { return require("./KEYS").KEYS; }
function getLOGGER(): any { return require("./LOGGER").LOGGER; }
function getMAP(): any { return require("./MAP").MAP; }
function getPOPUPS(): any { return require("./POPUPS").POPUPS; }
function getUI2(): any { return require("./UI2").UI2; }


/**
 * BUILDING14 - Town Hall (Core Building)
 * Extends BSTORAGE for the main town hall building
 */
export class BUILDING14 extends BSTORAGE implements ICoreBuilding {
    public static readonly k_TYPE: number = 14;
    public static readonly UNDERHALL_LEVEL: string = "underhalLevel";

    constructor() {
        super();
        this._type = 14;
        this._footprint = getBASE().isInfernoMainYardOrOutpost ? [new Rectangle(0, 0, 160, 160)] : [new Rectangle(0, 0, 130, 130)];
        this._gridCost = getBASE().isInfernoMainYardOrOutpost 
            ? [[new Rectangle(0, 0, 160, 160), 10], [new Rectangle(10, 10, 140, 140), 200]]
            : [[new Rectangle(0, 0, 130, 130), 10], [new Rectangle(10, 10, 110, 110), 200]];
        this._spoutPoint = new Point(1, -67);
        this._spoutHeight = 135;
        this.SetProps();
    }

    public override Repair(): void {
        super.Repair();
    }

    public override Place(event: MouseEvent | null = null): void {
        if (!getMAP()._dragged) {
            super.Place(event);
            this._hasResources = true;
        }
    }

    public override Cancel(): void {
        getGLOBAL().setTownHall(null);
        super.Cancel();
    }

    public override Recycle(): void {
        getGLOBAL().Message(getKEYS().Get("msg_cantrecycleth", { v1: getGLOBAL().townHall._buildingProps.name }));
    }

    public override RecycleB(event: MouseEvent | null = null): void {
        getGLOBAL().Message(getKEYS().Get("msg_cantrecycleth", { v1: getGLOBAL().townHall._buildingProps.name }));
    }

    public override RecycleC(): void {
        getGLOBAL().Message(getKEYS().Get("msg_cantrecycleth", { v1: getGLOBAL().townHall._buildingProps.name }));
    }

    public override Destroyed(byAttacker: boolean = true): void {
        super.Destroyed(byAttacker);
        if (!getMapRoomManager().instance.isInMapRoom2or3 && getGLOBAL().mode === "wmattack") {
            WMBASE._destroyed = true;
        }
    }

    public override Description(): void {
        super.Description();
        this._buildingDescription = getKEYS().Get("th_upgradedesc");
        if (this._lvl.Get() === 1) {
            this._recycleDescription = getKEYS().Get("th_recycledesc");
        }
        if (this._lvl.Get() > 0 && this._lvl.Get() < this._buildingProps.costs.length) {
            const newBuildings: any[] = [];
            const moreBuildings: any[] = [];
            const upgradeBuildings: any[] = [];
            
            for (const buildingProps of getGLOBAL()._buildingProps) {
                if (buildingProps.id !== 14) {
                    const maxIdx: number = buildingProps.quantity.length - 1;
                    const currentLevel: number = this._lvl.Get();
                    const currentQuantity: number = buildingProps.quantity[Math.min(currentLevel, maxIdx)];
                    const nextQuantity: number = buildingProps.quantity[Math.min(currentLevel + 1, maxIdx)];
                    const diff: number = nextQuantity - currentQuantity;
                    
                    if (currentQuantity === 0 && nextQuantity > 0 && !buildingProps.block) {
                        newBuildings.push([0, getKEYS().Get(buildingProps.name)]);
                    } else if (diff > 0 && !buildingProps.block) {
                        moreBuildings.push([0, getKEYS().Get(buildingProps.name) + "s"]);
                    }
                }
            }
            
            if (newBuildings.length > 0) {
                this._upgradeDescription += getKEYS().Get("th_willunlockthe", { v1: getGLOBAL().Array2StringB(newBuildings) }) + "<br><br>";
            }
            if (moreBuildings.length > 0) {
                this._upgradeDescription += `<b>${getKEYS().Get("th_willbuildmore")}</b><br>${getGLOBAL().Array2StringB(moreBuildings)}<br><br>`;
            }
            if (upgradeBuildings.length > 0) {
                this._upgradeDescription += `<b>${getKEYS().Get("th_willupgrade")}</b><br>${getGLOBAL().Array2StringB(upgradeBuildings)}`;
            }
            if (getGLOBAL()._buildingProps[this._type - 1].additionalUpgradeInfo?.[this._lvl.Get() - 1]) {
                this._upgradeDescription += `<br><br><b>${getKEYS().Get(getGLOBAL()._buildingProps[this._type - 1].additionalUpgradeInfo[this._lvl.Get() - 1])}</b>`;
            }
        }
    }

    public override Update(force: boolean = false): void {
        super.Update(force);
    }

    public override Constructed(): void {
        getGLOBAL().setTownHall(this);
        ACHIEVEMENTS.Check("thlevel", this._lvl.Get());
        ACHIEVEMENTS.Check(ACHIEVEMENTS.UNDERHALL_LEVEL, this._lvl.Get());
        super.Constructed();
    }

    public override UpgradeB(): void {
        super.UpgradeB();
        if (this._lvl.Get() >= 2 && this._countdownUpgrade.Get() > 0 && 
            this._countdownUpgrade.Get() * (20 / 60 / 60) > getBASE()._credits.Get()) {
            getPOPUPS().DisplayPleaseBuy("TH");
        }
    }

    public override Upgraded(): void {
        getLOGGER().KongStat([2, this._lvl.Get()]);
        ACHIEVEMENTS.Check("thlevel", this._lvl.Get());
        ACHIEVEMENTS.Check(ACHIEVEMENTS.UNDERHALL_LEVEL, this._lvl.Get());
        super.Upgraded();
        this.UnlockBuildings();
    }

    private UnlockBuildings(): void {
        if (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.BUILD) {
            const level: number = this._lvl.Get();
            if (getBASE().isInfernoMainYardOrOutpost) {
                getGLOBAL().StatSet(BUILDING14.UNDERHALL_LEVEL, level);
            } else {
                getGLOBAL().attackingPlayer.townHallLevel = level;
            }
        }
    }

    public override Setup(building: any): void {
        super.Setup(building);
        getGLOBAL().setTownHall(this);
        if (this._destroyed && getUI2()._top) {
            getUI2()._top.validateSiegeWeapon();
        }
        this.UnlockBuildings();
        ACHIEVEMENTS.Check("thlevel", this._lvl.Get());
        ACHIEVEMENTS.Check(ACHIEVEMENTS.UNDERHALL_LEVEL, this._lvl.Get());
    }
}
