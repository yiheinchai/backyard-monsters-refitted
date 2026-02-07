import Event from "openfl/events/Event";
import MouseEvent from "openfl/events/MouseEvent";

import { popup_attackend_CLIP } from "../../../../popup_attackend_CLIP";
import { SingletonLock } from "../../../../config/singletonlock/SingletonLock";

// Lazy imports to break circular dependency chains
function getMapRoomManager(): any { return require("../../maproom_manager/MapRoomManager").MapRoomManager; }
function getKEYS(): any { return require("../../../../KEYS").KEYS; }
function getBASE(): any { return require("../../../../BASE").BASE; }
function getPOPUPS(): any { return require("../../../../POPUPS").POPUPS; }



/**
 * Map Room 3 attack finished popup - shows attack result with map button.
 */
export class MapRoom3AttackFinishedPopup extends popup_attackend_CLIP {
    private static s_Instance: MapRoom3AttackFinishedPopup | null = null;

    constructor(lock: SingletonLock) {
        super();
    }

    public static get instance(): MapRoom3AttackFinishedPopup {
        return MapRoom3AttackFinishedPopup.s_Instance = MapRoom3AttackFinishedPopup.s_Instance || new MapRoom3AttackFinishedPopup(new SingletonLock());
    }

    public Show(isVictory: boolean): void {
        if (isVictory) {
            this.tTitle.htmlText = getKEYS().Get("newmap_destroyed");
            this.tMessage.htmlText = getBASE().isOutpost ? getKEYS().Get("newmap_des_pl1") : getKEYS().Get("newmap_des_wm2");
        } else {
            this.tTitle.htmlText = getKEYS().Get("popup_attackended_title");
            this.tMessage.htmlText = getBASE().isOutpost ? getKEYS().Get("mr3_popup_attackended_failedOutpost") : getKEYS().Get("mr3_popup_attackended_failedWMYard");
        }
        this.tProcessing.htmlText = getKEYS().Get("please_wait");
        this.mcFrame.Setup(false);
        this.bAction.Setup(getKEYS().Get("btn_openmap"));
        this.bAction.Enabled = false;
        this.addEventListener(Event.ENTER_FRAME, this.OnEnterFrame.bind(this));
        getPOPUPS().Push(this);
    }

    public Hide(): void {
        getPOPUPS().Next();
    }

    private OnEnterFrame(event: Event): void {
        if (getBASE()._saveCounterA !== getBASE()._saveCounterB) {
            return;
        }
        this.bAction.Enabled = true;
        this.tProcessing.htmlText = "";
        this.bAction.addEventListener(MouseEvent.CLICK, this.OnActionButtonClicked.bind(this));
        this.removeEventListener(Event.ENTER_FRAME, this.OnEnterFrame.bind(this));
    }

    private OnActionButtonClicked(event: MouseEvent): void {
        getMapRoomManager().instance.SetupAndShow();
        getPOPUPS().Next();
    }
}
