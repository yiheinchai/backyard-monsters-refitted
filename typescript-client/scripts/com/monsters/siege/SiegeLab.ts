import { SecNum } from "../../cc/utils/SecNum";
import { SiegeBuilding } from "./SiegeBuilding";

import { SiegeWeapon } from "./weapons/SiegeWeapon";

// Lazy imports to break circular dependency chains
function getSiegeWeapons(): any { return require("./SiegeWeapons").SiegeWeapons; }
function getBASE(): any { return require("../../../BASE").BASE; }
function getGLOBAL(): any { return require("../../../GLOBAL").GLOBAL; }
function getKEYS(): any { return require("../../../KEYS").KEYS; }
function getLOGGER(): any { return require("../../../LOGGER").LOGGER; }
function getQUESTS(): any { return require("../../../QUESTS").QUESTS; }
function getSTORE(): any { return require("../../../STORE").STORE; }


/**
 * Siege Lab building - upgrades siege weapons.
 */
export class SiegeLab extends SiegeBuilding {
    public static readonly ID: number = 134;
    public static readonly SIEGE_BUTTON: string = "btn_siegelab";

    constructor() {
        super();
        this._type = SiegeLab.ID;
    }

    public static Show(): void {
        if (getGLOBAL()._bSiegeLab.health >= getGLOBAL()._bSiegeLab.maxHealth * 0.5) {
            SiegeBuilding.Show("lab");
        } else {
            getGLOBAL().Message(getKEYS().Get("msg_sworks_damaged"));
        }
    }

    public Setup(data: any): void {
        getGLOBAL()._bSiegeLab = this;
        super.Setup(data);
    }

    public Constructed(): void {
        getGLOBAL()._bSiegeLab = this;
        super.Constructed();
    }

    public Upgrade(): boolean {
        if (this.upgradingWeapon) {
            if (this.upgradingWeapon.level > 0) {
                getGLOBAL().Message(getKEYS().Get("msg_sworks_cantupgrade2"));
            } else {
                getGLOBAL().Message(getKEYS().Get("msg_sworks_cantupgrade1"));
            }
            return false;
        }
        return super.Upgrade();
    }

    public Recycle(): void {
        if (this.upgradingWeapon) {
            if (this.upgradingWeapon.level > 0) {
                getGLOBAL().Message(getKEYS().Get("msg_sworks_cantrecycle2"));
            } else {
                getGLOBAL().Message(getKEYS().Get("msg_sworks_cantrecycle1"));
            }
            return;
        }
        super.Recycle();
    }

    public RecycleC(): void {
        getGLOBAL()._bSiegeLab = null;
        super.RecycleC();
    }

    protected UpgradeWeapon(weaponId: string): void {
        getSiegeWeapons().getWeapon(weaponId).level++;
        getQUESTS().Check("siege_" + weaponId + "_level", getSiegeWeapons().getWeapon(weaponId).level);
    }

    public StartUpgradingWeapon(weaponId: string): void {
        const costs = getSiegeWeapons().getWeapon(weaponId).upgradeCosts;
        this.unlockingWeapons[weaponId] = new SecNum(costs.time);
        getBASE().Charge(1, costs.r1, false, true);
        getBASE().Charge(2, costs.r2, false, true);
        getBASE().Charge(3, costs.r3, false, true);
        getBASE().Charge(4, costs.r4, false, true);
        getBASE().Save();
        
        const level = getSiegeWeapons().getWeapon(weaponId).level;
        if (level === 0) {
            getLOGGER().Stat([90, weaponId, level, "start"]);
        } else {
            getLOGGER().Stat([91, weaponId, level, "start"]);
        }
    }

    public CancelUpgradingWeapon(weaponId: string): void {
        this._animTick = 0;
        this.AnimFrame();
        if (!this.unlockingWeapons[weaponId]) {
            return;
        }
        delete this.unlockingWeapons[weaponId];
        const costs = getSiegeWeapons().getWeapon(weaponId).upgradeCosts;
        getBASE().Fund(1, costs.r1, false, null, true);
        getBASE().Fund(2, costs.r2, false, null, true);
        getBASE().Fund(3, costs.r3, false, null, true);
        getBASE().Fund(4, costs.r4, false, null, true);
        getBASE().Save();
        
        const level = getSiegeWeapons().getWeapon(weaponId).level;
        if (level === 0) {
            getLOGGER().Stat([90, weaponId, level, "cancel"]);
        } else {
            getLOGGER().Stat([91, weaponId, level, "cancel"]);
        }
    }

    public FinishUpgradingWeapon(weaponId: string): void {
        this._animTick = 0;
        this.AnimFrame();
        if (!this.unlockingWeapons[weaponId]) {
            return;
        }
        delete this.unlockingWeapons[weaponId];
        getBASE().Save();
        
        const level = getSiegeWeapons().getWeapon(weaponId).level;
        if (level === 0) {
            getLOGGER().Stat([90, weaponId, level, "finish"]);
        } else {
            getLOGGER().Stat([91, weaponId, level, "finish"]);
        }
    }

    public InstantUpgrade(weaponId: string): void {
        const cost = this.getInstantUpgradeCost(weaponId);
        this.CompleteUpgradingWeapon(weaponId);
        getBASE().Purchase("IBSW", cost, "building");
        
        const level = getSiegeWeapons().getWeapon(weaponId).level;
        if (level === 0) {
            getLOGGER().Stat([90, weaponId, level, "instant", cost]);
        } else {
            getLOGGER().Stat([91, weaponId, level, "instant", cost]);
        }
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
        return weapon.instantUpgradeCost;
    }

    public HasEnoughShinyToUpgrade(weapon: SiegeWeapon): boolean {
        return getBASE()._credits.Get() >= this.getInstantUpgradeCost(weapon.weaponID);
    }

    public UpgradeTimeTotal(weapon: SiegeWeapon): number {
        return weapon.upgradeCosts.time;
    }
}
