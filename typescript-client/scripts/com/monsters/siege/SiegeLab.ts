import { SecNum } from "../../cc/utils/SecNum";
import { SiegeBuilding } from "./SiegeBuilding";
import { SiegeWeapons } from "./SiegeWeapons";

import { BASE } from "../../../BASE";
import { GLOBAL } from "../../../GLOBAL";
import { KEYS } from "../../../KEYS";
import { LOGGER } from "../../../LOGGER";
import { QUESTS } from "../../../QUESTS";
import { STORE } from "../../../STORE";

// Forward declaration
declare class SiegeWeapon {
    weaponID: string;
    level: number;
    upgradeCosts: any;
    instantUpgradeCost: number;
}

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
        if (GLOBAL._bSiegeLab.health >= GLOBAL._bSiegeLab.maxHealth * 0.5) {
            SiegeBuilding.Show("lab");
        } else {
            GLOBAL.Message(KEYS.Get("msg_sworks_damaged"));
        }
    }

    public Setup(data: any): void {
        GLOBAL._bSiegeLab = this;
        super.Setup(data);
    }

    public Constructed(): void {
        GLOBAL._bSiegeLab = this;
        super.Constructed();
    }

    public Upgrade(): boolean {
        if (this.upgradingWeapon) {
            if (this.upgradingWeapon.level > 0) {
                GLOBAL.Message(KEYS.Get("msg_sworks_cantupgrade2"));
            } else {
                GLOBAL.Message(KEYS.Get("msg_sworks_cantupgrade1"));
            }
            return false;
        }
        return super.Upgrade();
    }

    public Recycle(): void {
        if (this.upgradingWeapon) {
            if (this.upgradingWeapon.level > 0) {
                GLOBAL.Message(KEYS.Get("msg_sworks_cantrecycle2"));
            } else {
                GLOBAL.Message(KEYS.Get("msg_sworks_cantrecycle1"));
            }
            return;
        }
        super.Recycle();
    }

    public RecycleC(): void {
        GLOBAL._bSiegeLab = null;
        super.RecycleC();
    }

    protected UpgradeWeapon(weaponId: string): void {
        SiegeWeapons.getWeapon(weaponId).level++;
        QUESTS.Check("siege_" + weaponId + "_level", SiegeWeapons.getWeapon(weaponId).level);
    }

    public StartUpgradingWeapon(weaponId: string): void {
        const costs = SiegeWeapons.getWeapon(weaponId).upgradeCosts;
        this.unlockingWeapons[weaponId] = new SecNum(costs.time);
        BASE.Charge(1, costs.r1, false, true);
        BASE.Charge(2, costs.r2, false, true);
        BASE.Charge(3, costs.r3, false, true);
        BASE.Charge(4, costs.r4, false, true);
        BASE.Save();
        
        const level = SiegeWeapons.getWeapon(weaponId).level;
        if (level === 0) {
            LOGGER.Stat([90, weaponId, level, "start"]);
        } else {
            LOGGER.Stat([91, weaponId, level, "start"]);
        }
    }

    public CancelUpgradingWeapon(weaponId: string): void {
        this._animTick = 0;
        this.AnimFrame();
        if (!this.unlockingWeapons[weaponId]) {
            return;
        }
        delete this.unlockingWeapons[weaponId];
        const costs = SiegeWeapons.getWeapon(weaponId).upgradeCosts;
        BASE.Fund(1, costs.r1, false, null, true);
        BASE.Fund(2, costs.r2, false, null, true);
        BASE.Fund(3, costs.r3, false, null, true);
        BASE.Fund(4, costs.r4, false, null, true);
        BASE.Save();
        
        const level = SiegeWeapons.getWeapon(weaponId).level;
        if (level === 0) {
            LOGGER.Stat([90, weaponId, level, "cancel"]);
        } else {
            LOGGER.Stat([91, weaponId, level, "cancel"]);
        }
    }

    public FinishUpgradingWeapon(weaponId: string): void {
        this._animTick = 0;
        this.AnimFrame();
        if (!this.unlockingWeapons[weaponId]) {
            return;
        }
        delete this.unlockingWeapons[weaponId];
        BASE.Save();
        
        const level = SiegeWeapons.getWeapon(weaponId).level;
        if (level === 0) {
            LOGGER.Stat([90, weaponId, level, "finish"]);
        } else {
            LOGGER.Stat([91, weaponId, level, "finish"]);
        }
    }

    public InstantUpgrade(weaponId: string): void {
        const cost = this.getInstantUpgradeCost(weaponId);
        this.CompleteUpgradingWeapon(weaponId);
        BASE.Purchase("IBSW", cost, "building");
        
        const level = SiegeWeapons.getWeapon(weaponId).level;
        if (level === 0) {
            LOGGER.Stat([90, weaponId, level, "instant", cost]);
        } else {
            LOGGER.Stat([91, weaponId, level, "instant", cost]);
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
        const weapon = SiegeWeapons.getWeapon(weaponId);
        if (this.upgradingWeapon && this.upgradingWeapon.weaponID === weaponId) {
            return STORE.GetTimeCost(this.UpgradeTimeLeft(weapon));
        }
        return weapon.instantUpgradeCost;
    }

    public HasEnoughShinyToUpgrade(weapon: SiegeWeapon): boolean {
        return BASE._credits.Get() >= this.getInstantUpgradeCost(weapon.weaponID);
    }

    public UpgradeTimeTotal(weapon: SiegeWeapon): number {
        return weapon.upgradeCosts.time;
    }
}
