import { KOTHPromoMessage } from "./KOTHPromoMessage";

// Lazy imports to break circular dependency chains
function getMapRoomManager(): any { return require("../../../../maproom_manager/MapRoomManager").MapRoomManager; }
function getGLOBAL(): any { return require("../../../../../../GLOBAL").GLOBAL; }
function getKEYS(): any { return require("../../../../../../KEYS").KEYS; }



/**
 * King of the Hill start message - shown when KOTH event starts.
 */
export class KOTHStartMessage extends KOTHPromoMessage {
    constructor() {
        super("event_kothstart");
        if (getMapRoomManager().instance.isInMapRoom2or3) {
            this._action = this.openMapRoom.bind(this);
            this._buttonCopy = getKEYS().Get("btn_openmap");
        } else if (Boolean(getGLOBAL()._bMap) && getGLOBAL().townHall._lvl.Get() >= 6) {
            this._buttonCopy = getKEYS().Get("btn_upgradenow");
            this._action = this.upgradeMapRoom.bind(this);
        }
        const useVideo: boolean = false;
        if (useVideo) {
            this.videoURL = "assets/popups/front_page/fp_event_kothstart.flv";
        } else {
            this.imageURL = "popups/front_page/fp_event_kothstart.v2.jpg";
        }
    }

    private openMapRoom(): void {
        getGLOBAL().ShowMap();
    }
}
