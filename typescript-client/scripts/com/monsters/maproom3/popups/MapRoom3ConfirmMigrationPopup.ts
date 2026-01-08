import { MouseEvent } from "openfl/events/MouseEvent";

import { MapRoomManager } from "../../maproom_manager/MapRoomManager";
import { popup_new_map_confirm } from "../../../popup_new_map_confirm";
import { SingletonLock } from "config/singletonlock/SingletonLock";

import { GLOBAL } from "../../../../GLOBAL";
import { KEYS } from "../../../../KEYS";
import { POPUPS } from "../../../../POPUPS";
import { SOUNDS } from "../../../../SOUNDS";

/**
 * Map room 3 confirm migration popup - confirmation for upgrading to map room 3.
 */
export class MapRoom3ConfirmMigrationPopup extends popup_new_map_confirm {
    private static s_Instance: MapRoom3ConfirmMigrationPopup | null = null;

    private m_IsShowing: boolean = false;

    constructor(lock: SingletonLock) {
        super();
    }

    public static get instance(): MapRoom3ConfirmMigrationPopup {
        return MapRoom3ConfirmMigrationPopup.s_Instance = MapRoom3ConfirmMigrationPopup.s_Instance || new MapRoom3ConfirmMigrationPopup(new SingletonLock());
    }

    public Show(forceMode: boolean = false): void {
        if (this.m_IsShowing === true || GLOBAL._flags.maproom2) {
            return;
        }
        this.tfTitle.htmlText = KEYS.Get("nwm_confirm_title");
        this.tfBody.htmlText = KEYS.Get("nwm_confirm");
        this.btnJuice.SetupKey("btn_joinnow");
        this.btnJuice.addEventListener(MouseEvent.CLICK, this.OnConfirmButtonClicked.bind(this), false, 0, true);
        this.btnJuice.Highlight = true;
        this.btnCancel.SetupKey("btn_cancel");
        this.btnCancel.addEventListener(MouseEvent.CLICK, this.OnCancelButtonClicked.bind(this), false, 0, true);
        if (forceMode) {
            this.tfBody.htmlText = KEYS.Get("nwm_confirm_force");
            this.btnJuice.SetupKey("btn_ok");
            this.btnJuice.x = 0;
            this.btnCancel.visible = false;
            this.mcFrame.Setup(false);
        }
        POPUPS.Push(this);
        this.m_IsShowing = true;
    }

    public Hide(): void {
        this.btnJuice.removeEventListener(MouseEvent.CLICK, this.OnConfirmButtonClicked.bind(this));
        this.btnCancel.removeEventListener(MouseEvent.CLICK, this.OnCancelButtonClicked.bind(this));
        SOUNDS.Play("close");
        POPUPS.Next();
        this.m_IsShowing = false;
    }

    public Resize(): void {
        this.x = GLOBAL._SCREENCENTER.x;
        this.y = GLOBAL._SCREENCENTER.y;
    }

    private OnConfirmButtonClicked(event: MouseEvent): void {
        this.Hide();
        MapRoomManager.instance.UpgradeToMapRoom3();
    }

    private OnCancelButtonClicked(event: MouseEvent): void {
        this.Hide();
    }
}
