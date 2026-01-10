import { InstanceManager } from "com.monsters.managers.InstanceManager";
import Sprite from "openfl/display/Sprite";
import Event from "openfl/events/Event";
import { TweenLite } from "gs";
import { GLOBAL } from "./GLOBAL";
import { INFERNOPORTAL } from "./INFERNOPORTAL";
import { MAPROOM_DESCENT } from "./MAPROOM_DESCENT";
import { BASE } from "./BASE";
import { TUTORIAL } from "./TUTORIAL";
import { POPUPS } from "./POPUPS";
import { BUILDINGOPTIONS } from "./BUILDINGOPTIONS";
import { BUILDINGS } from "./BUILDINGS";
import { STORE } from "./STORE";
import { UI2 } from "./UI2";
import { MAP } from "./MAP";
import { KEYS } from "./KEYS";
import { SOUNDS } from "./SOUNDS";
import { INFERNO_EMERGENCE_POPUPS } from "./INFERNO_EMERGENCE_POPUPS";
import { INFERNO_PORTAL_ATTACK } from "./INFERNO_PORTAL_ATTACK";
import { BFOUNDATION } from "./BFOUNDATION";

export class INFERNO_EMERGENCE_EVENT {
    public static readonly TOWN_HALL_LEVEL_REQUIREMENT: number = 5;
    public static isAttackActive: boolean;
    public static readonly _LAST_LEVEL_LABEL: string = "lastLevel";
    public static readonly EVENT_END_DATE: Date = new Date(2012, 0, 14);
    
    private static readonly _MINIMUM_BASE_HEALTH: number = 0.1;
    private static readonly _SHOULD_RUN_EVENT: boolean = true;
    private static readonly _ATTACK_DELAY: number = 3;
    private static readonly _FOCUS_DELAY: number = 3;
    private static readonly _SHAKE_AMOUNT: number = 100;
    private static readonly _LAST_TIME_LABEL: string = "lastTime";
    private static readonly _WARNING_KEY: string = "emerge_earthquake";
    
    private static _lastLevel: number;
    private static _isPostEvent: boolean;
    private static _currentDate: Date;
    private static ns: string; // "postEvent" or "duringEvent"
    public static isGoingToAttack: boolean;

    constructor() {
        // Empty constructor
    }

    private static get _intermissionDuration(): number {
        return 43200;
    }

    private static get _maxLevel(): number {
        return 5;
    }

    public static get Lvl(): number {
        return INFERNO_EMERGENCE_EVENT._lastLevel;
    }

    public static Initialize(): boolean {
        if (GLOBAL.mode != GLOBAL.e_BASE_MODE.BUILD) {
            return false;
        }
        INFERNO_EMERGENCE_EVENT._lastLevel = GLOBAL.StatGet(INFERNO_EMERGENCE_EVENT._LAST_LEVEL_LABEL);
        INFERNO_EMERGENCE_EVENT._currentDate = new Date();
        if (INFERNO_EMERGENCE_EVENT.ShouldShowPortal() && INFERNO_EMERGENCE_EVENT._maxLevel > 5 || BASE.isInfernoMainYardOrOutpost && MAPROOM_DESCENT.DescentPassed && GLOBAL.mode == GLOBAL.e_BASE_MODE.BUILD) {
            INFERNOPORTAL.AddPortal(5);
            return false;
        }
        INFERNO_EMERGENCE_EVENT.ns = INFERNO_EMERGENCE_EVENT.IsPostEvent() ? "postEvent" : "duringEvent";
        if (INFERNO_EMERGENCE_EVENT.ShouldShowUpgradePopup()) {
            INFERNO_EMERGENCE_EVENT.ShowUpgradePopup();
        }
        if (!INFERNO_EMERGENCE_EVENT.ShouldShowPortal()) {
            return false;
        }
        INFERNO_EMERGENCE_EVENT.SetupPortal();
        return true;
    }

    private static ShowUpgradePopup(): void {
        if (GLOBAL.StatGet(INFERNO_EMERGENCE_POPUPS.INFERNO_UPGRADE_SHOWN) == 0 && GLOBAL.townHall._lvl.Get() >= 5) {
            INFERNO_EMERGENCE_POPUPS.ShowUpgrade();
            GLOBAL.StatSet(INFERNO_EMERGENCE_POPUPS.INFERNO_UPGRADE_SHOWN, 1);
        }
    }

    private static SetupPortal(): void {
        const _loc1_: INFERNOPORTAL = INFERNOPORTAL.AddPortal(INFERNO_EMERGENCE_EVENT._lastLevel);
        if (INFERNO_EMERGENCE_EVENT._lastLevel == 0) {
            _loc1_.Hide();
            TweenLite.delayedCall(INFERNO_EMERGENCE_EVENT._FOCUS_DELAY, INFERNO_EMERGENCE_EVENT.FocusOnPortal);
            INFERNO_EMERGENCE_EVENT.isGoingToAttack = true;
        } else if (Boolean(INFERNO_EMERGENCE_EVENT.ShouldUpgradePortal(INFERNO_EMERGENCE_EVENT._lastLevel)) && INFERNO_EMERGENCE_EVENT.isBaseReadyForAttack()) {
            TweenLite.delayedCall(INFERNO_EMERGENCE_EVENT._FOCUS_DELAY, INFERNO_EMERGENCE_EVENT.FocusOnPortal);
            INFERNO_EMERGENCE_EVENT.isGoingToAttack = true;
        }
    }

    private static Save(): void {
        GLOBAL.StatSet(INFERNO_EMERGENCE_EVENT._LAST_LEVEL_LABEL, INFERNOPORTAL.building._lvl.Get(), false);
        GLOBAL.StatSet(INFERNO_EMERGENCE_EVENT._LAST_TIME_LABEL, INFERNO_EMERGENCE_EVENT._currentDate.getTime() / 1000, false);
        BASE.Save(0, false, true);
    }

    public static IsBelowMaxLevel(param1: number): boolean {
        const _loc2_: number = GLOBAL.StatGet(INFERNO_EMERGENCE_EVENT._LAST_TIME_LABEL);
        if (INFERNO_EMERGENCE_EVENT._currentDate.getTime() / 1000 - _loc2_ >= INFERNO_EMERGENCE_EVENT._intermissionDuration) {
            if (param1 < INFERNO_EMERGENCE_EVENT._maxLevel) {
                return true;
            }
        }
        return false;
    }

    public static ShouldUpgradePortal(param1: number): boolean {
        return INFERNO_EMERGENCE_EVENT.IsBelowMaxLevel(param1);
    }

    public static GetLastLevelLevel(): number {
        return INFERNO_EMERGENCE_EVENT._lastLevel + 1;
    }

    public static GetUpgradeLevel(): number {
        if (INFERNO_EMERGENCE_EVENT.isLastDay()) {
            return INFERNO_EMERGENCE_EVENT._maxLevel;
        }
        return INFERNO_EMERGENCE_EVENT.GetLastLevelLevel();
    }

    public static FocusOnPortal(): void {
        if (!INFERNO_EMERGENCE_EVENT.ShouldShowPortal()) {
            return;
        }
        if (POPUPS._open || BUILDINGOPTIONS._open || BUILDINGS._open || STORE._open) {
            TweenLite.delayedCall(1, INFERNO_EMERGENCE_EVENT.FocusOnPortal);
            return;
        }
        UI2.Hide("top");
        UI2.Hide("wmbar");
        UI2.Hide("bottom");
        const _loc1_: Sprite = INFERNOPORTAL.building._mc;
        MAP.FocusTo(_loc1_.x, _loc1_.y, 2, 0, 0, true, INFERNO_EMERGENCE_EVENT.FocusedOnPortal);
    }

    private static FocusedOnPortal(): void {
        if (!INFERNO_EMERGENCE_EVENT.ShouldShowPortal()) {
            return;
        }
        if (INFERNO_EMERGENCE_EVENT._lastLevel == 0) {
            INFERNO_EMERGENCE_EVENT.ShowStartPopup();
        } else {
            INFERNO_EMERGENCE_EVENT.UpgradePortal();
        }
    }

    private static UpgradePortal(param1: Event = null): void {
        if (!INFERNO_EMERGENCE_EVENT.ShouldShowPortal()) {
            return;
        }
        const _loc2_: INFERNOPORTAL = INFERNOPORTAL.building;
        _loc2_.Show();
        _loc2_.SetLevel(INFERNO_EMERGENCE_EVENT.GetUpgradeLevel());
        INFERNO_EMERGENCE_EVENT.Save();
        if (!INFERNO_EMERGENCE_EVENT.isBaseReadyForAttack()) {
            return;
        }
        UI2.Show("warning");
        UI2._warning.Update("<font size=\"26\">" + KEYS.Get(INFERNO_EMERGENCE_EVENT._WARNING_KEY) + "</font>");
        BASE.Shake(INFERNO_EMERGENCE_EVENT._SHAKE_AMOUNT);
        TweenLite.delayedCall(INFERNO_EMERGENCE_EVENT._ATTACK_DELAY, INFERNO_EMERGENCE_EVENT.ShowWarningPopup);
    }

    private static ShowStartPopup(): void {
        INFERNO_EMERGENCE_POPUPS.ShowDialogue(INFERNO_EMERGENCE_EVENT._lastLevel).addEventListener(INFERNO_EMERGENCE_POPUPS.EVENT_DIALOGUE_DEFAULT, INFERNO_EMERGENCE_EVENT.UpgradePortal, false, 0, true);
    }

    private static ShowWarningPopup(): void {
        INFERNO_EMERGENCE_EVENT.isAttackActive = true;
        INFERNO_EMERGENCE_POPUPS.ShowWarning(INFERNO_EMERGENCE_EVENT._lastLevel);
    }

    public static TriggerAttack(param1: Event): void {
        SOUNDS.PlayMusic("musicpanic");
        INFERNO_PORTAL_ATTACK.SpawnAttack();
    }

    private static isBaseReadyForAttack(): boolean {
        let _loc2_: number = 0;
        let _loc3_: number = 0;
        let _loc5_: BFOUNDATION = null;
        let _loc6_: number = NaN;
        const _loc1_: boolean = false;
        const _loc4_: Array<any> = InstanceManager.getInstancesByClass(BFOUNDATION);
        for (const building of _loc4_) {
            _loc5_ = building as BFOUNDATION;
            _loc2_ += _loc5_.health;
            _loc3_ += _loc5_.maxHealth;
        }
        _loc6_ = _loc2_ / _loc3_;
        return _loc2_ / _loc3_ > INFERNO_EMERGENCE_EVENT._MINIMUM_BASE_HEALTH;
    }

    public static ShouldShowPortal(): boolean {
        return INFERNO_EMERGENCE_EVENT._SHOULD_RUN_EVENT && !GLOBAL._flags.viximo && GLOBAL.mode == GLOBAL.e_BASE_MODE.BUILD && GLOBAL.townHall && (INFERNO_EMERGENCE_EVENT.ns == "duringEvent" || INFERNO_EMERGENCE_EVENT.ns == "postEvent" && GLOBAL.townHall && GLOBAL.townHall._lvl.Get() >= INFERNO_EMERGENCE_EVENT.TOWN_HALL_LEVEL_REQUIREMENT || INFERNO_EMERGENCE_EVENT.ns == "postEvent" && INFERNO_EMERGENCE_EVENT._lastLevel > 0) && INFERNO_EMERGENCE_EVENT._maxLevel > 0 && BASE.isMainYardOrInfernoMainYard && TUTORIAL._stage > 200;
    }

    public static ShouldRunEvent(): boolean {
        return INFERNO_EMERGENCE_EVENT._SHOULD_RUN_EVENT && !GLOBAL._flags.viximo && GLOBAL.mode == GLOBAL.e_BASE_MODE.BUILD && GLOBAL.townHall && (INFERNO_EMERGENCE_EVENT.ns == "duringEvent" || INFERNO_EMERGENCE_EVENT.ns == "postEvent" && GLOBAL.townHall._lvl.Get() >= INFERNO_EMERGENCE_EVENT.TOWN_HALL_LEVEL_REQUIREMENT || INFERNO_EMERGENCE_EVENT.ns == "postEvent" && INFERNO_EMERGENCE_EVENT._lastLevel > 0) && INFERNO_EMERGENCE_EVENT._maxLevel > 0 && INFERNO_EMERGENCE_EVENT._lastLevel < 5 && BASE.isMainYard && TUTORIAL._stage > 200;
    }

    public static ShouldShowUpgradePopup(): boolean {
        return INFERNO_EMERGENCE_EVENT._SHOULD_RUN_EVENT && !GLOBAL._flags.viximo && GLOBAL.mode == GLOBAL.e_BASE_MODE.BUILD && INFERNO_EMERGENCE_EVENT._maxLevel > 0 && BASE.isMainYardOrInfernoMainYard && TUTORIAL._stage > 200;
    }

    public static IsPostEvent(): boolean {
        return INFERNO_EMERGENCE_EVENT._currentDate.getTime() / 1000 > INFERNO_EMERGENCE_EVENT.EVENT_END_DATE.getTime() / 1000;
    }

    public static isLastDay(): boolean {
        return false;
    }

    public static EndRound(): void {
        INFERNO_EMERGENCE_EVENT.isAttackActive = false;
    }
}
