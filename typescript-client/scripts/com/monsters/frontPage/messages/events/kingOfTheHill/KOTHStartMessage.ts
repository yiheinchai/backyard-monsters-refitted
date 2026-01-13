import { KOTHPromoMessage } from "./KOTHPromoMessage";
import { MapRoomManager } from "../../../../maproom_manager/MapRoomManager";

import { GLOBAL } from "../../../../../../GLOBAL";
import { KEYS } from "../../../../../../KEYS";

/**
 * King of the Hill start message - shown when KOTH event starts.
 */
export class KOTHStartMessage extends KOTHPromoMessage {
    constructor() {
        super("event_kothstart");
        if (MapRoomManager.instance.isInMapRoom2or3) {
            this._action = this.openMapRoom.bind(this);
            this._buttonCopy = KEYS.Get("btn_openmap");
        } else if (Boolean(GLOBAL._bMap) && GLOBAL.townHall._lvl.Get() >= 6) {
            this._buttonCopy = KEYS.Get("btn_upgradenow");
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
        GLOBAL.ShowMap();
    }
}
