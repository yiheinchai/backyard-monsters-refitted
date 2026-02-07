import Sprite from "openfl/display/Sprite";
import Event from "openfl/events/Event";
import { TweenLite } from "./gs";
import { MAPROOM_DESCENT } from "./MAPROOM_DESCENT";
import { INFERNO_EMERGENCE_POPUPS } from "./INFERNO_EMERGENCE_POPUPS";
import { INFERNO_PORTAL_ATTACK } from "./INFERNO_PORTAL_ATTACK";

// Lazy imports to break circular dependency chains
function getInstanceManager(): any { return require("./com/monsters/managers/InstanceManager").InstanceManager; }
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getINFERNOPORTAL(): any { return require("./INFERNOPORTAL").INFERNOPORTAL; }
function getBASE(): any { return require("./BASE").BASE; }
function getTUTORIAL(): any { return require("./TUTORIAL").TUTORIAL; }
function getPOPUPS(): any { return require("./POPUPS").POPUPS; }
function getBUILDINGOPTIONS(): any { return require("./BUILDINGOPTIONS").BUILDINGOPTIONS; }
function getBUILDINGS(): any { return require("./BUILDINGS").BUILDINGS; }
function getSTORE(): any { return require("./STORE").STORE; }
function getUI2(): any { return require("./UI2").UI2; }
function getMAP(): any { return require("./MAP").MAP; }
function getKEYS(): any { return require("./KEYS").KEYS; }
function getSOUNDS(): any { return require("./SOUNDS").SOUNDS; }
function getBFOUNDATION(): any { return require("./BFOUNDATION").BFOUNDATION; }


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
        if (getGLOBAL().mode != getGLOBAL().e_BASE_MODE.BUILD) {
            return false;
        }
        INFERNO_EMERGENCE_EVENT._lastLevel = getGLOBAL().StatGet(INFERNO_EMERGENCE_EVENT._LAST_LEVEL_LABEL);
        INFERNO_EMERGENCE_EVENT._currentDate = new Date();
        if (INFERNO_EMERGENCE_EVENT.ShouldShowPortal() && INFERNO_EMERGENCE_EVENT._maxLevel > 5 || getBASE().isInfernoMainYardOrOutpost && MAPROOM_DESCENT.DescentPassed && getGLOBAL().mode == getGLOBAL().e_BASE_MODE.BUILD) {
            getINFERNOPORTAL().AddPortal(5);
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
        if (getGLOBAL().StatGet(INFERNO_EMERGENCE_POPUPS.INFERNO_UPGRADE_SHOWN) == 0 && getGLOBAL().townHall._lvl.Get() >= 5) {
            INFERNO_EMERGENCE_POPUPS.ShowUpgrade();
            getGLOBAL().StatSet(INFERNO_EMERGENCE_POPUPS.INFERNO_UPGRADE_SHOWN, 1);
        }
    }

    private static SetupPortal(): void {
        const _loc1_: INFERNOPORTAL = getINFERNOPORTAL().AddPortal(INFERNO_EMERGENCE_EVENT._lastLevel);
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
        getGLOBAL().StatSet(INFERNO_EMERGENCE_EVENT._LAST_LEVEL_LABEL, getINFERNOPORTAL().building._lvl.Get(), false);
        getGLOBAL().StatSet(INFERNO_EMERGENCE_EVENT._LAST_TIME_LABEL, INFERNO_EMERGENCE_EVENT._currentDate.getTime() / 1000, false);
        getBASE().Save(0, false, true);
    }

    public static IsBelowMaxLevel(param1: number): boolean {
        const _loc2_: number = getGLOBAL().StatGet(INFERNO_EMERGENCE_EVENT._LAST_TIME_LABEL);
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
        if (getPOPUPS()._open || getBUILDINGOPTIONS()._open || getBUILDINGS()._open || getSTORE()._open) {
            TweenLite.delayedCall(1, INFERNO_EMERGENCE_EVENT.FocusOnPortal);
            return;
        }
        getUI2().Hide("top");
        getUI2().Hide("wmbar");
        getUI2().Hide("bottom");
        const _loc1_: Sprite = getINFERNOPORTAL().building._mc;
        getMAP().FocusTo(_loc1_.x, _loc1_.y, 2, 0, 0, true, INFERNO_EMERGENCE_EVENT.FocusedOnPortal);
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
        const _loc2_: INFERNOPORTAL = getINFERNOPORTAL().building;
        _loc2_.Show();
        _loc2_.SetLevel(INFERNO_EMERGENCE_EVENT.GetUpgradeLevel());
        INFERNO_EMERGENCE_EVENT.Save();
        if (!INFERNO_EMERGENCE_EVENT.isBaseReadyForAttack()) {
            return;
        }
        getUI2().Show("warning");
        getUI2()._warning.Update("<font size=\"26\">" + getKEYS().Get(INFERNO_EMERGENCE_EVENT._WARNING_KEY) + "</font>");
        getBASE().Shake(INFERNO_EMERGENCE_EVENT._SHAKE_AMOUNT);
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
        getSOUNDS().PlayMusic("musicpanic");
        INFERNO_PORTAL_ATTACK.SpawnAttack();
    }

    private static isBaseReadyForAttack(): boolean {
        let _loc2_: number = 0;
        let _loc3_: number = 0;
        let _loc5_: BFOUNDATION = null;
        let _loc6_: number = NaN;
        const _loc1_: boolean = false;
        const _loc4_: Array<any> = getInstanceManager().getInstancesByClass(BFOUNDATION);
        for (const building of _loc4_) {
            _loc5_ = building as BFOUNDATION;
            _loc2_ += _loc5_.health;
            _loc3_ += _loc5_.maxHealth;
        }
        _loc6_ = _loc2_ / _loc3_;
        return _loc2_ / _loc3_ > INFERNO_EMERGENCE_EVENT._MINIMUM_BASE_HEALTH;
    }

    public static ShouldShowPortal(): boolean {
        return INFERNO_EMERGENCE_EVENT._SHOULD_RUN_EVENT && !getGLOBAL()._flags.viximo && getGLOBAL().mode == getGLOBAL().e_BASE_MODE.BUILD && getGLOBAL().townHall && (INFERNO_EMERGENCE_EVENT.ns == "duringEvent" || INFERNO_EMERGENCE_EVENT.ns == "postEvent" && getGLOBAL().townHall && getGLOBAL().townHall._lvl.Get() >= INFERNO_EMERGENCE_EVENT.TOWN_HALL_LEVEL_REQUIREMENT || INFERNO_EMERGENCE_EVENT.ns == "postEvent" && INFERNO_EMERGENCE_EVENT._lastLevel > 0) && INFERNO_EMERGENCE_EVENT._maxLevel > 0 && getBASE().isMainYardOrInfernoMainYard && getTUTORIAL()._stage > 200;
    }

    public static ShouldRunEvent(): boolean {
        return INFERNO_EMERGENCE_EVENT._SHOULD_RUN_EVENT && !getGLOBAL()._flags.viximo && getGLOBAL().mode == getGLOBAL().e_BASE_MODE.BUILD && getGLOBAL().townHall && (INFERNO_EMERGENCE_EVENT.ns == "duringEvent" || INFERNO_EMERGENCE_EVENT.ns == "postEvent" && getGLOBAL().townHall._lvl.Get() >= INFERNO_EMERGENCE_EVENT.TOWN_HALL_LEVEL_REQUIREMENT || INFERNO_EMERGENCE_EVENT.ns == "postEvent" && INFERNO_EMERGENCE_EVENT._lastLevel > 0) && INFERNO_EMERGENCE_EVENT._maxLevel > 0 && INFERNO_EMERGENCE_EVENT._lastLevel < 5 && getBASE().isMainYard && getTUTORIAL()._stage > 200;
    }

    public static ShouldShowUpgradePopup(): boolean {
        return INFERNO_EMERGENCE_EVENT._SHOULD_RUN_EVENT && !getGLOBAL()._flags.viximo && getGLOBAL().mode == getGLOBAL().e_BASE_MODE.BUILD && INFERNO_EMERGENCE_EVENT._maxLevel > 0 && getBASE().isMainYardOrInfernoMainYard && getTUTORIAL()._stage > 200;
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
