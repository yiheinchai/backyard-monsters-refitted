import Event from "openfl/events/Event";
import MouseEvent from "openfl/events/MouseEvent";

import { MapRoomManager } from "../../maproom_manager/MapRoomManager";
import { popup_attackend_CLIP } from "../../../../popup_attackend_CLIP";
import { SingletonLock } from "config/singletonlock/SingletonLock";

import { KEYS } from "../../../../KEYS";
import { BASE } from "../../../../BASE";
import { POPUPS } from "../../../../POPUPS";

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
            this.tTitle.htmlText = KEYS.Get("newmap_destroyed");
            this.tMessage.htmlText = BASE.isOutpost ? KEYS.Get("newmap_des_pl1") : KEYS.Get("newmap_des_wm2");
        } else {
            this.tTitle.htmlText = KEYS.Get("popup_attackended_title");
            this.tMessage.htmlText = BASE.isOutpost ? KEYS.Get("mr3_popup_attackended_failedOutpost") : KEYS.Get("mr3_popup_attackended_failedWMYard");
        }
        this.tProcessing.htmlText = KEYS.Get("please_wait");
        this.mcFrame.Setup(false);
        this.bAction.Setup(KEYS.Get("btn_openmap"));
        this.bAction.Enabled = false;
        this.addEventListener(Event.ENTER_FRAME, this.OnEnterFrame.bind(this));
        POPUPS.Push(this);
    }

    public Hide(): void {
        POPUPS.Next();
    }

    private OnEnterFrame(event: Event): void {
        if (BASE._saveCounterA !== BASE._saveCounterB) {
            return;
        }
        this.bAction.Enabled = true;
        this.tProcessing.htmlText = "";
        this.bAction.addEventListener(MouseEvent.CLICK, this.OnActionButtonClicked.bind(this));
        this.removeEventListener(Event.ENTER_FRAME, this.OnEnterFrame.bind(this));
    }

    private OnActionButtonClicked(event: MouseEvent): void {
        MapRoomManager.instance.SetupAndShow();
        POPUPS.Next();
    }
}
