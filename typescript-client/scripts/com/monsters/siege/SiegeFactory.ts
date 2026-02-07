import MouseEvent from "openfl/events/MouseEvent";

import { SecNum } from "../../cc/utils/SecNum";
import { SiegeBuilding } from "./SiegeBuilding";

import { SiegeWeapon } from "./weapons/SiegeWeapon";
import { popup_siegebrag } from "../../../popup_siegebrag";

// Lazy imports to break circular dependency chains
function getSiegeWeapons(): any { return require("./SiegeWeapons").SiegeWeapons; }
function getDecoy(): any { return require("./weapons/Decoy").Decoy; }
function getJars(): any { return require("./weapons/Jars").Jars; }
function getVacuum(): any { return require("./weapons/Vacuum").Vacuum; }
function getBASE(): any { return require("../../../BASE").BASE; }
function getGLOBAL(): any { return require("../../../GLOBAL").GLOBAL; }
function getKEYS(): any { return require("../../../KEYS").KEYS; }
function getLOGGER(): any { return require("../../../LOGGER").LOGGER; }
function getPOPUPS(): any { return require("../../../POPUPS").POPUPS; }
function getQUESTS(): any { return require("../../../QUESTS").QUESTS; }
function getSTORE(): any { return require("../../../STORE").STORE; }


/**
 * Siege Factory building - builds siege weapons.
 */
export class SiegeFactory extends SiegeBuilding {
    public static readonly ID: number = 133;
    public static readonly SIEGE_BUTTON: string = "btn_siegefactory";

    constructor() {
        super();
        this._type = SiegeFactory.ID;
        getGLOBAL()._bSiegeFactory = this;
    }

    public static Show(): void {
        if (getGLOBAL()._bSiegeFactory.health >= getGLOBAL()._bSiegeFactory.maxHealth * 0.5) {
            SiegeBuilding.Show("factory");
        } else {
            getGLOBAL().Message(getKEYS().Get("msg_sfactory_damaged"));
        }
    }

    public Setup(data: any): void {
        getGLOBAL()._bSiegeFactory = this;
        super.Setup(data);
    }

    public Constructed(): void {
        getGLOBAL()._bSiegeFactory = this;
        super.Constructed();
    }

    public get hasBuiltWeapon(): boolean {
        for (const weaponId in getSiegeWeapons().weapons) {
            const weapon = getSiegeWeapons().weapons[weaponId];
            if (weapon.quantity > 0) {
                return true;
            }
        }
        return false;
    }

    public Upgrade(): boolean {
        if (this.upgradingWeapon) {
            getGLOBAL().Message(getKEYS().Get("msg_sfactory_cantupgrade1"));
        } else {
            if (!this.hasBuiltWeapon) {
                return super.Upgrade();
            }
            getGLOBAL().Message(getKEYS().Get("msg_sfactory_cantupgrade2"));
        }
        return false;
    }

    public Recycle(): void {
        if (this.upgradingWeapon) {
            getGLOBAL().Message(getKEYS().Get("msg_sfactory_cantrecycle1"));
        } else {
            if (!this.hasBuiltWeapon) {
                super.Recycle();
                return;
            }
            getGLOBAL().Message(getKEYS().Get("msg_sfactory_cantrecycle2"));
        }
    }

    public RecycleC(): void {
        getGLOBAL()._bSiegeFactory = null;
        super.RecycleC();
    }

    private ShowWarnDialog(weapon: SiegeWeapon): void {
        const Post = (event: MouseEvent): void => {
            if (weapon.weaponID === getJars().ID) {
                getGLOBAL().CallJS("sendFeed", ["siege-weapon-build", getKEYS().Get("warn_jars_streamtitle"), getKEYS().Get("warn_jars_streambody"), "siegebuild_" + weapon.weaponID + ".png", 0]);
            } else if (weapon.weaponID === getDecoy().ID) {
                getGLOBAL().CallJS("sendFeed", ["siege-weapon-build", getKEYS().Get("warn_decoy_streamtitle"), getKEYS().Get("warn_decoy_streambody"), "siegebuild_" + weapon.weaponID + ".png", 0]);
            } else if (weapon.weaponID === getVacuum().ID) {
                getGLOBAL().CallJS("sendFeed", ["siege-weapon-build", getKEYS().Get("warn_vacuum_streamtitle"), getKEYS().Get("warn_vacuum_streambody"), "siegebuild_" + weapon.weaponID + ".png", 0]);
            }
            getPOPUPS().Next();
        };
        
        const popup = new popup_siegebrag();
        popup.tText.htmlText = getKEYS().Get("msg_weaponbuilt", {
            v1: weapon.name,
            v2: weapon.level,
            v3: weapon.name
        });
        popup.bAction.SetupKey("btn_warnyourfriends");
        popup.bAction.addEventListener(MouseEvent.CLICK, Post);
        popup.bAction.Highlight = true;
        popup.bSpeedup.visible = false;
        getPOPUPS().Push(popup, null, null, null, weapon.warnPopupImage);
    }

    protected ShowBragPopup(weaponId: string): void {
        this.ShowWarnDialog(getSiegeWeapons().getWeapon(weaponId));
    }

    protected UpgradeWeapon(weaponId: string): void {
        getSiegeWeapons().getWeapon(weaponId).quantity = 1;
        getQUESTS().Check("siege_" + weaponId + "_built", getSiegeWeapons().getWeapon(weaponId).quantity);
    }

    public StartUpgradingWeapon(weaponId: string): void {
        const costs = getSiegeWeapons().getWeapon(weaponId).buildCosts;
        this.unlockingWeapons[weaponId] = new SecNum(costs.time);
        getBASE().Charge(1, costs.r1, false, true);
        getBASE().Charge(2, costs.r2, false, true);
        getBASE().Charge(3, costs.r3, false, true);
        getBASE().Charge(4, costs.r4, false, true);
        getBASE().Save();
        getLOGGER().Stat([92, weaponId, getSiegeWeapons().getWeapon(weaponId).level, "start"]);
    }

    public CancelUpgradingWeapon(weaponId: string): void {
        this._animTick = 0;
        this.AnimFrame();
        if (!this.unlockingWeapons[weaponId]) {
            return;
        }
        delete this.unlockingWeapons[weaponId];
        const costs = getSiegeWeapons().getWeapon(weaponId).buildCosts;
        getBASE().Fund(1, costs.r1, false, null, true);
        getBASE().Fund(2, costs.r2, false, null, true);
        getBASE().Fund(3, costs.r3, false, null, true);
        getBASE().Fund(4, costs.r4, false, null, true);
        getBASE().Save();
        getLOGGER().Stat([92, weaponId, getSiegeWeapons().getWeapon(weaponId).level, "cancel"]);
    }

    public FinishUpgradingWeapon(weaponId: string): void {
        this._animTick = 0;
        this.AnimFrame();
        if (!this.unlockingWeapons[weaponId]) {
            return;
        }
        delete this.unlockingWeapons[weaponId];
        getBASE().Save();
        getLOGGER().Stat([92, weaponId, getSiegeWeapons().getWeapon(weaponId).level, "finish"]);
    }

    public InstantUpgrade(weaponId: string): void {
        const cost = this.getInstantUpgradeCost(weaponId);
        this.CompleteUpgradingWeapon(weaponId);
        getBASE().Purchase("IBSW", cost, "building");
        getLOGGER().Stat([92, weaponId, getSiegeWeapons().getWeapon(weaponId).level, "instant", cost]);
    }

    public CompleteUpgradingWeapon(weaponId: string, showBrag: boolean = true): void {
        if (showBrag) {
            this.ShowBragPopup(weaponId);
        }
        this.UpgradeWeapon(weaponId);
        this.FinishUpgradingWeapon(weaponId);
    }

    public getInstantUpgradeCost(weaponId: string): number {
        const weapon = getSiegeWeapons().getWeapon(weaponId);
        if (this.upgradingWeapon && this.upgradingWeapon.weaponID === weaponId) {
            return getSTORE().GetTimeCost(this.UpgradeTimeLeft(weapon));
        }
        return weapon.instantBuildCost;
    }

    public HasEnoughShinyToUpgrade(weapon: SiegeWeapon): boolean {
        return getBASE()._credits.Get() >= this.getInstantUpgradeCost(weapon.weaponID);
    }

    public UpgradeTimeTotal(weapon: SiegeWeapon): number {
        return weapon.buildCosts.time;
    }
}
