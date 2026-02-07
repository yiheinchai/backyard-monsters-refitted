import MouseEvent from "openfl/events/MouseEvent";

import { popup_new_map_confirm } from "../../../../popup_new_map_confirm";
import { SingletonLock } from "../../../../config/singletonlock/SingletonLock";

// Lazy imports to break circular dependency chains
function getMapRoomManager(): any { return require("../../maproom_manager/MapRoomManager").MapRoomManager; }
function getGLOBAL(): any { return require("../../../../GLOBAL").GLOBAL; }
function getKEYS(): any { return require("../../../../KEYS").KEYS; }
function getPOPUPS(): any { return require("../../../../POPUPS").POPUPS; }
function getSOUNDS(): any { return require("../../../../SOUNDS").SOUNDS; }



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
        if (this.m_IsShowing === true || getGLOBAL()._flags.maproom2) {
            return;
        }
        this.tfTitle.htmlText = getKEYS().Get("nwm_confirm_title");
        this.tfBody.htmlText = getKEYS().Get("nwm_confirm");
        this.btnJuice.SetupKey("btn_joinnow");
        this.btnJuice.addEventListener(MouseEvent.CLICK, this.OnConfirmButtonClicked.bind(this), false, 0, true);
        this.btnJuice.Highlight = true;
        this.btnCancel.SetupKey("btn_cancel");
        this.btnCancel.addEventListener(MouseEvent.CLICK, this.OnCancelButtonClicked.bind(this), false, 0, true);
        if (forceMode) {
            this.tfBody.htmlText = getKEYS().Get("nwm_confirm_force");
            this.btnJuice.SetupKey("btn_ok");
            this.btnJuice.x = 0;
            this.btnCancel.visible = false;
            this.mcFrame.Setup(false);
        }
        getPOPUPS().Push(this);
        this.m_IsShowing = true;
    }

    public Hide(): void {
        this.btnJuice.removeEventListener(MouseEvent.CLICK, this.OnConfirmButtonClicked.bind(this));
        this.btnCancel.removeEventListener(MouseEvent.CLICK, this.OnCancelButtonClicked.bind(this));
        getSOUNDS().Play("close");
        getPOPUPS().Next();
        this.m_IsShowing = false;
    }

    public Resize(): void {
        this.x = getGLOBAL()._SCREENCENTER.x;
        this.y = getGLOBAL()._SCREENCENTER.y;
    }

    private OnConfirmButtonClicked(event: MouseEvent): void {
        this.Hide();
        getMapRoomManager().instance.UpgradeToMapRoom3();
    }

    private OnCancelButtonClicked(event: MouseEvent): void {
        this.Hide();
    }
}
