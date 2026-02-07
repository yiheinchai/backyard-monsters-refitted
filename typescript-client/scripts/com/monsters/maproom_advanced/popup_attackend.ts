import Sprite from "openfl/display/Sprite";
import Event from "openfl/events/Event";
import MouseEvent from "openfl/events/MouseEvent";

import { EnumYardType } from "../enums/EnumYardType";
import { MapRoomCell } from "./MapRoomCell";
import { MapRoom } from "./MapRoom";

import { MAPROOM_DESCENT } from "../../../MAPROOM_DESCENT";
import { popup_attackend_CLIP } from "../../../popup_attackend_CLIP";

// Lazy imports to break circular dependency chains
function getMapRoomManager(): any { return require("../maproom_manager/MapRoomManager").MapRoomManager; }
function getBASE(): any { return require("../../../BASE").BASE; }
function getGLOBAL(): any { return require("../../../GLOBAL").GLOBAL; }
function getKEYS(): any { return require("../../../KEYS").KEYS; }
function getPOPUPS(): any { return require("../../../POPUPS").POPUPS; }


/**
 * Attack end popup - shown when an attack ends (success or failure).
 */
export class popup_attackend extends popup_attackend_CLIP {
    private _success: boolean;

    constructor(success: boolean) {
        super();
        this._success = success;
        
        if (this._success) {
            this.tTitle.htmlText = getKEYS().Get("newmap_destroyed");
            if (getMapRoomManager().instance.isInMapRoom2) {
                if (getGLOBAL().mode === (GLOBAL as any).e_BASE_MODE.WMATTACK) {
                    this.tMessage.htmlText = getKEYS().Get("newmap_des_wm2");
                } else {
                    this.tMessage.htmlText = getKEYS().Get("newmap_des_pl1");
                }
            } else if (getGLOBAL().mode === (GLOBAL as any).e_BASE_MODE.WMATTACK) {
                if (getBASE().isInfernoMainYardOrOutpost) {
                    if (MAPROOM_DESCENT.InDescent) {
                        this.tMessage.htmlText = getKEYS().Get("descent_newmap_des_wm2");
                    } else {
                        this.tMessage.htmlText = getKEYS().Get("inf_newmap_des_wm2");
                    }
                } else {
                    this.tMessage.htmlText = getKEYS().Get("newmap_des_wm2");
                }
            } else {
                this.tMessage.htmlText = getKEYS().Get("newmap_des_pl2");
            }
        } else {
            this.tTitle.htmlText = getKEYS().Get("popup_attackended_title");
            if (getMapRoomManager().instance.isInMapRoom2) {
                if (getGLOBAL().mode === (GLOBAL as any).e_BASE_MODE.WMATTACK) {
                    this.tMessage.htmlText = getKEYS().Get("popup_attackended_failedWMYard");
                } else if (getBASE().isOutpost) {
                    this.tMessage.htmlText = getKEYS().Get("popup_attackended_failedOutpost");
                } else {
                    this.tMessage.htmlText = "";
                }
            } else if (getGLOBAL().mode === (GLOBAL as any).e_BASE_MODE.WMATTACK) {
                if (getBASE().isInfernoMainYardOrOutpost) {
                    if (MAPROOM_DESCENT.InDescent) {
                        this.tMessage.htmlText = getKEYS().Get("descent_popup_attackended_failedWMTH");
                    } else {
                        this.tMessage.htmlText = getKEYS().Get("inf_popup_attackended_failedWMTH");
                    }
                } else {
                    this.tMessage.htmlText = getKEYS().Get("popup_attackended_failedWMTH");
                }
            } else {
                this.tMessage.htmlText = "";
            }
        }
        
        this.tProcessing.htmlText = getKEYS().Get("please_wait");
        this.bAction.Enabled = false;
        
        if (!getMapRoomManager().instance.isInMapRoom2 || getBASE().isInfernoMainYardOrOutpost) {
            this.bAction.Setup(getKEYS().Get("btn_returnhome"));
        } else {
            this.bAction.Setup(getKEYS().Get("btn_openmap"));
        }
        
        this.addEventListener(Event.ENTER_FRAME, this.Tick.bind(this));
    }

    private Tick(event: Event): void {
        if (getBASE()._saveCounterA === getBASE()._saveCounterB) {
            this.bAction.Enabled = true;
            this.tProcessing.htmlText = "";
            this.bAction.addEventListener(MouseEvent.CLICK, this.End.bind(this));
            this.removeEventListener(Event.ENTER_FRAME, this.Tick.bind(this));
        }
    }

    private End(event: MouseEvent): void {
        if (getMapRoomManager().instance.isInMapRoom2) {
            MapRoom.showEnemyWait = true;
            if (this._success && getGLOBAL()._currentCell) {
                (getGLOBAL()._currentCell as MapRoomCell).destroyed = 1;
            }
            getMapRoomManager().instance.Show();
        } else if (getGLOBAL()._loadmode === getGLOBAL().mode) {
            getBASE().LoadBase(null, 0, 0, (GLOBAL as any).e_BASE_MODE.BUILD, false, EnumYardType.MAIN_YARD);
        } else if (MAPROOM_DESCENT._inDescent) {
            MAPROOM_DESCENT.ExitDescent();
            getBASE().LoadBase(null, 0, 0, (GLOBAL as any).e_BASE_MODE.BUILD, false, EnumYardType.MAIN_YARD);
        } else {
            getBASE().LoadBase(getGLOBAL()._infBaseURL, 0, 0, "ibuild", false, EnumYardType.INFERNO_YARD);
        }
        getPOPUPS().Next();
    }
}
