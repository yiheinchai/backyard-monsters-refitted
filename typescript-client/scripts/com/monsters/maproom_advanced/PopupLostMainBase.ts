import Sprite from "openfl/display/Sprite";
import IOErrorEvent from "openfl/events/IOErrorEvent";
import MouseEvent from "openfl/events/MouseEvent";
import Point from "openfl/geom/Point";

import { MapRoom } from "./MapRoom";

import { GLOBAL } from "../../../GLOBAL";
import { KEYS } from "../../../KEYS";
import { LOGGER } from "../../../LOGGER";
import { PLEASEWAIT } from "../../../PLEASEWAIT";
import { POPUPS } from "../../../POPUPS";
import { URLLoaderApi } from "../../../URLLoaderApi";

// Forward declaration
declare class MapRoomManager {
    static instance: { BookmarksClear: () => void; ShowDelayed: (flag: boolean) => void };
}

// Declare popup clip class
declare class MapRoomPopup_LostMainBase_CLIP extends Sprite {
    tTitle: any;
    tDesc: any;
    tWarning: any;
    bYes: any;
    bNo: any;
}

/**
 * Popup shown when player loses their main base.
 */
export class PopupLostMainBase extends MapRoomPopup_LostMainBase_CLIP {
    constructor() {
        super();
    }

    public Setup(): void {
        this.tTitle.htmlText = KEYS.Get("empiredestroyed_title");
        this.bYes.SetupKey("empiredestroyed_btnflee");
        this.bYes.addEventListener(MouseEvent.CLICK, this.Relocate.bind(this));
        this.bYes.buttonMode = true;
        this.bNo.SetupKey("empiredestroyed_btnstay");
        this.bNo.addEventListener(MouseEvent.CLICK, this.Hide.bind(this));
        
        if (GLOBAL._mapOutpost.length > 0) {
            if (GLOBAL._mapOutpost.length > 1) {
                this.tDesc.htmlText = "<b>" + KEYS.Get("empiredestroyed3", { v1: GLOBAL._mapOutpost.length }) + "</b>";
            } else {
                this.tDesc.htmlText = "<b>" + KEYS.Get("empiredestroyed2") + "</b>";
            }
            this.tWarning.htmlText = "<b>" + KEYS.Get("msg_moveyard_warn2") + "</b>";
        } else {
            this.tDesc.htmlText = "<b>" + KEYS.Get("empiredestroyed1") + "</b>";
            this.tWarning.visible = false;
        }
    }

    public Relocate(event: MouseEvent | null = null): void {
        const RelocateSuccess = (response: any): void => {
            PLEASEWAIT.Hide();
            if (response.error === 0) {
                if (response.cantMoveTill) {
                    GLOBAL.Message(KEYS.Get("movebase_warning", { v1: GLOBAL.ToTime(response.cantMoveTill - response.currenttime) }));
                    this.Hide();
                } else {
                    GLOBAL._mapOutpost = [];
                    MapRoom.ClearCells();
                    if (response.coords && response.coords.length === 2 && response.coords[0] > -1 && response.coords[1] > -1) {
                        GLOBAL._mapHome = new Point(response.coords[0], response.coords[1]);
                        MapRoomManager.instance.BookmarksClear();
                        MapRoom._Setup(GLOBAL._mapHome);
                        MapRoom.empireDestroyed = true;
                        MapRoomManager.instance.ShowDelayed(true);
                    }
                }
            } else {
                GLOBAL.ErrorMessage("PopupLostMainBase.Relocate 1");
                LOGGER.Log("err", "PopupLostMainBase.Relocate non-zero error " + response.error);
            }
        };

        const RelocateFail = (event: IOErrorEvent): void => {
            PLEASEWAIT.Hide();
            GLOBAL.ErrorMessage("PopupLostMainBase.Relocate 2");
            LOGGER.Log("err", "PopupLostMainBase.Relocate HTTP");
        };

        const relocateVars: any[][] = [["type", "random"], ["baseid", 0], ["shiny", 0]];
        POPUPS.Next();
        PLEASEWAIT.Show(KEYS.Get("wait_relocating"));
        new URLLoaderApi().load(GLOBAL._baseURL + "migrate", relocateVars, RelocateSuccess, RelocateFail);
    }

    public Hide(event: MouseEvent | null = null): void {
        POPUPS.Next();
    }
}
