import { Sprite } from "openfl/display/Sprite";
import { Event } from "openfl/events/Event";
import { MouseEvent } from "openfl/events/MouseEvent";

import { EnumYardType } from "../enums/EnumYardType";
import { MapRoomCell } from "./MapRoomCell";
import { MapRoom } from "./MapRoom";

import { BASE } from "../../../BASE";
import { GLOBAL } from "../../../GLOBAL";
import { KEYS } from "../../../KEYS";
import { MAPROOM_DESCENT } from "../../../MAPROOM_DESCENT";
import { POPUPS } from "../../../POPUPS";

// Forward declaration for MapRoomManager
declare class MapRoomManager {
    static instance: { isInMapRoom2: boolean; Show: () => void };
}

// Declare popup clip class
declare class popup_attackend_CLIP extends Sprite {
    tTitle: any;
    tMessage: any;
    tProcessing: any;
    bAction: any;
}

/**
 * Attack end popup - shown when an attack ends (success or failure).
 */
export class popup_attackend extends popup_attackend_CLIP {
    private _success: boolean;

    constructor(success: boolean) {
        super();
        this._success = success;
        
        if (this._success) {
            this.tTitle.htmlText = KEYS.Get("newmap_destroyed");
            if (MapRoomManager.instance.isInMapRoom2) {
                if (GLOBAL.mode === (GLOBAL as any).e_BASE_MODE.WMATTACK) {
                    this.tMessage.htmlText = KEYS.Get("newmap_des_wm2");
                } else {
                    this.tMessage.htmlText = KEYS.Get("newmap_des_pl1");
                }
            } else if (GLOBAL.mode === (GLOBAL as any).e_BASE_MODE.WMATTACK) {
                if (BASE.isInfernoMainYardOrOutpost) {
                    if (MAPROOM_DESCENT.InDescent) {
                        this.tMessage.htmlText = KEYS.Get("descent_newmap_des_wm2");
                    } else {
                        this.tMessage.htmlText = KEYS.Get("inf_newmap_des_wm2");
                    }
                } else {
                    this.tMessage.htmlText = KEYS.Get("newmap_des_wm2");
                }
            } else {
                this.tMessage.htmlText = KEYS.Get("newmap_des_pl2");
            }
        } else {
            this.tTitle.htmlText = KEYS.Get("popup_attackended_title");
            if (MapRoomManager.instance.isInMapRoom2) {
                if (GLOBAL.mode === (GLOBAL as any).e_BASE_MODE.WMATTACK) {
                    this.tMessage.htmlText = KEYS.Get("popup_attackended_failedWMYard");
                } else if (BASE.isOutpost) {
                    this.tMessage.htmlText = KEYS.Get("popup_attackended_failedOutpost");
                } else {
                    this.tMessage.htmlText = "";
                }
            } else if (GLOBAL.mode === (GLOBAL as any).e_BASE_MODE.WMATTACK) {
                if (BASE.isInfernoMainYardOrOutpost) {
                    if (MAPROOM_DESCENT.InDescent) {
                        this.tMessage.htmlText = KEYS.Get("descent_popup_attackended_failedWMTH");
                    } else {
                        this.tMessage.htmlText = KEYS.Get("inf_popup_attackended_failedWMTH");
                    }
                } else {
                    this.tMessage.htmlText = KEYS.Get("popup_attackended_failedWMTH");
                }
            } else {
                this.tMessage.htmlText = "";
            }
        }
        
        this.tProcessing.htmlText = KEYS.Get("please_wait");
        this.bAction.Enabled = false;
        
        if (!MapRoomManager.instance.isInMapRoom2 || BASE.isInfernoMainYardOrOutpost) {
            this.bAction.Setup(KEYS.Get("btn_returnhome"));
        } else {
            this.bAction.Setup(KEYS.Get("btn_openmap"));
        }
        
        this.addEventListener(Event.ENTER_FRAME, this.Tick.bind(this));
    }

    private Tick(event: Event): void {
        if (BASE._saveCounterA === BASE._saveCounterB) {
            this.bAction.Enabled = true;
            this.tProcessing.htmlText = "";
            this.bAction.addEventListener(MouseEvent.CLICK, this.End.bind(this));
            this.removeEventListener(Event.ENTER_FRAME, this.Tick.bind(this));
        }
    }

    private End(event: MouseEvent): void {
        if (MapRoomManager.instance.isInMapRoom2) {
            MapRoom.showEnemyWait = true;
            if (this._success && GLOBAL._currentCell) {
                (GLOBAL._currentCell as MapRoomCell).destroyed = 1;
            }
            MapRoomManager.instance.Show();
        } else if (GLOBAL._loadmode === GLOBAL.mode) {
            BASE.LoadBase(null, 0, 0, (GLOBAL as any).e_BASE_MODE.BUILD, false, EnumYardType.MAIN_YARD);
        } else if (MAPROOM_DESCENT._inDescent) {
            MAPROOM_DESCENT.ExitDescent();
            BASE.LoadBase(null, 0, 0, (GLOBAL as any).e_BASE_MODE.BUILD, false, EnumYardType.MAIN_YARD);
        } else {
            BASE.LoadBase(GLOBAL._infBaseURL, 0, 0, "ibuild", false, EnumYardType.INFERNO_YARD);
        }
        POPUPS.Next();
    }
}
