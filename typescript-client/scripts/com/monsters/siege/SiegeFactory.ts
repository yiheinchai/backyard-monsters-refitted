import { MouseEvent } from "openfl/events/MouseEvent";

import { SecNum } from "../../cc/utils/SecNum";
import { SiegeBuilding } from "./SiegeBuilding";
import { SiegeWeapons } from "./SiegeWeapons";
import { Decoy } from "./weapons/Decoy";
import { Jars } from "./weapons/Jars";
import { Vacuum } from "./weapons/Vacuum";

import { BASE } from "../../../BASE";
import { GLOBAL } from "../../../GLOBAL";
import { KEYS } from "../../../KEYS";
import { LOGGER } from "../../../LOGGER";
import { POPUPS } from "../../../POPUPS";
import { QUESTS } from "../../../QUESTS";
import { STORE } from "../../../STORE";

// Forward declaration
declare class SiegeWeapon {
    weaponID: string;
    level: number;
    quantity: number;
    name: string;
    buildCosts: any;
    instantBuildCost: number;
    warnPopupImage: string;
}

declare class popup_siegebrag {
    tText: any;
    bAction: any;
    bSpeedup: any;
}

/**
 * Siege Factory building - builds siege weapons.
 */
export class SiegeFactory extends SiegeBuilding {
    public static readonly ID: number = 133;
    public static readonly SIEGE_BUTTON: string = "btn_siegefactory";

    constructor() {
        super();
        this._type = SiegeFactory.ID;
        GLOBAL._bSiegeFactory = this;
    }

    public static Show(): void {
        if (GLOBAL._bSiegeFactory.health >= GLOBAL._bSiegeFactory.maxHealth * 0.5) {
            SiegeBuilding.Show("factory");
        } else {
            GLOBAL.Message(KEYS.Get("msg_sfactory_damaged"));
        }
    }

    public Setup(data: any): void {
        GLOBAL._bSiegeFactory = this;
        super.Setup(data);
    }

    public Constructed(): void {
        GLOBAL._bSiegeFactory = this;
        super.Constructed();
    }

    public get hasBuiltWeapon(): boolean {
        for (const weaponId in SiegeWeapons.weapons) {
            const weapon = SiegeWeapons.weapons[weaponId];
            if (weapon.quantity > 0) {
                return true;
            }
        }
        return false;
    }

    public Upgrade(): boolean {
        if (this.upgradingWeapon) {
            GLOBAL.Message(KEYS.Get("msg_sfactory_cantupgrade1"));
        } else {
            if (!this.hasBuiltWeapon) {
                return super.Upgrade();
            }
            GLOBAL.Message(KEYS.Get("msg_sfactory_cantupgrade2"));
        }
        return false;
    }

    public Recycle(): void {
        if (this.upgradingWeapon) {
            GLOBAL.Message(KEYS.Get("msg_sfactory_cantrecycle1"));
        } else {
            if (!this.hasBuiltWeapon) {
                super.Recycle();
                return;
            }
            GLOBAL.Message(KEYS.Get("msg_sfactory_cantrecycle2"));
        }
    }

    public RecycleC(): void {
        GLOBAL._bSiegeFactory = null;
        super.RecycleC();
    }

    private ShowWarnDialog(weapon: SiegeWeapon): void {
        const Post = (event: MouseEvent): void => {
            if (weapon.weaponID === Jars.ID) {
                GLOBAL.CallJS("sendFeed", ["siege-weapon-build", KEYS.Get("warn_jars_streamtitle"), KEYS.Get("warn_jars_streambody"), "siegebuild_" + weapon.weaponID + ".png", 0]);
            } else if (weapon.weaponID === Decoy.ID) {
                GLOBAL.CallJS("sendFeed", ["siege-weapon-build", KEYS.Get("warn_decoy_streamtitle"), KEYS.Get("warn_decoy_streambody"), "siegebuild_" + weapon.weaponID + ".png", 0]);
            } else if (weapon.weaponID === Vacuum.ID) {
                GLOBAL.CallJS("sendFeed", ["siege-weapon-build", KEYS.Get("warn_vacuum_streamtitle"), KEYS.Get("warn_vacuum_streambody"), "siegebuild_" + weapon.weaponID + ".png", 0]);
            }
            POPUPS.Next();
        };
        
        const popup = new popup_siegebrag();
        popup.tText.htmlText = KEYS.Get("msg_weaponbuilt", {
            v1: weapon.name,
            v2: weapon.level,
            v3: weapon.name
        });
        popup.bAction.SetupKey("btn_warnyourfriends");
        popup.bAction.addEventListener(MouseEvent.CLICK, Post);
        popup.bAction.Highlight = true;
        popup.bSpeedup.visible = false;
        POPUPS.Push(popup, null, null, null, weapon.warnPopupImage);
    }

    protected ShowBragPopup(weaponId: string): void {
        this.ShowWarnDialog(SiegeWeapons.getWeapon(weaponId));
    }

    protected UpgradeWeapon(weaponId: string): void {
        SiegeWeapons.getWeapon(weaponId).quantity = 1;
        QUESTS.Check("siege_" + weaponId + "_built", SiegeWeapons.getWeapon(weaponId).quantity);
    }

    public StartUpgradingWeapon(weaponId: string): void {
        const costs = SiegeWeapons.getWeapon(weaponId).buildCosts;
        this.unlockingWeapons[weaponId] = new SecNum(costs.time);
        BASE.Charge(1, costs.r1, false, true);
        BASE.Charge(2, costs.r2, false, true);
        BASE.Charge(3, costs.r3, false, true);
        BASE.Charge(4, costs.r4, false, true);
        BASE.Save();
        LOGGER.Stat([92, weaponId, SiegeWeapons.getWeapon(weaponId).level, "start"]);
    }

    public CancelUpgradingWeapon(weaponId: string): void {
        this._animTick = 0;
        this.AnimFrame();
        if (!this.unlockingWeapons[weaponId]) {
            return;
        }
        delete this.unlockingWeapons[weaponId];
        const costs = SiegeWeapons.getWeapon(weaponId).buildCosts;
        BASE.Fund(1, costs.r1, false, null, true);
        BASE.Fund(2, costs.r2, false, null, true);
        BASE.Fund(3, costs.r3, false, null, true);
        BASE.Fund(4, costs.r4, false, null, true);
        BASE.Save();
        LOGGER.Stat([92, weaponId, SiegeWeapons.getWeapon(weaponId).level, "cancel"]);
    }

    public FinishUpgradingWeapon(weaponId: string): void {
        this._animTick = 0;
        this.AnimFrame();
        if (!this.unlockingWeapons[weaponId]) {
            return;
        }
        delete this.unlockingWeapons[weaponId];
        BASE.Save();
        LOGGER.Stat([92, weaponId, SiegeWeapons.getWeapon(weaponId).level, "finish"]);
    }

    public InstantUpgrade(weaponId: string): void {
        const cost = this.getInstantUpgradeCost(weaponId);
        this.CompleteUpgradingWeapon(weaponId);
        BASE.Purchase("IBSW", cost, "building");
        LOGGER.Stat([92, weaponId, SiegeWeapons.getWeapon(weaponId).level, "instant", cost]);
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
        return weapon.instantBuildCost;
    }

    public HasEnoughShinyToUpgrade(weapon: SiegeWeapon): boolean {
        return BASE._credits.Get() >= this.getInstantUpgradeCost(weapon.weaponID);
    }

    public UpgradeTimeTotal(weapon: SiegeWeapon): number {
        return weapon.buildCosts.time;
    }
}
