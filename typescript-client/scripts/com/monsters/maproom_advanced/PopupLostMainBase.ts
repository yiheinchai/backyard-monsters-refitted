import Sprite from "openfl/display/Sprite";
import IOErrorEvent from "openfl/events/IOErrorEvent";
import MouseEvent from "openfl/events/MouseEvent";
import Point from "openfl/geom/Point";

import { MapRoom } from "./MapRoom";

import { PLEASEWAIT } from "../../../PLEASEWAIT";
import { MapRoomPopup_LostMainBase_CLIP } from "../../../MapRoomPopup_LostMainBase_CLIP";

// Lazy imports to break circular dependency chains
function getGLOBAL(): any { return require("../../../GLOBAL").GLOBAL; }
function getKEYS(): any { return require("../../../KEYS").KEYS; }
function getLOGGER(): any { return require("../../../LOGGER").LOGGER; }
function getPOPUPS(): any { return require("../../../POPUPS").POPUPS; }
function getURLLoaderApi(): any { return require("../../../URLLoaderApi").URLLoaderApi; }
function getMapRoomManager(): any { return require("../maproom_manager/MapRoomManager").MapRoomManager; }


/**
 * Popup shown when player loses their main base.
 */
export class PopupLostMainBase extends MapRoomPopup_LostMainBase_CLIP {
    constructor() {
        super();
    }

    public Setup(): void {
        this.tTitle.htmlText = getKEYS().Get("empiredestroyed_title");
        this.bYes.SetupKey("empiredestroyed_btnflee");
        this.bYes.addEventListener(MouseEvent.CLICK, this.Relocate.bind(this));
        this.bYes.buttonMode = true;
        this.bNo.SetupKey("empiredestroyed_btnstay");
        this.bNo.addEventListener(MouseEvent.CLICK, this.Hide.bind(this));
        
        if (getGLOBAL()._mapOutpost.length > 0) {
            if (getGLOBAL()._mapOutpost.length > 1) {
                this.tDesc.htmlText = "<b>" + getKEYS().Get("empiredestroyed3", { v1: getGLOBAL()._mapOutpost.length }) + "</b>";
            } else {
                this.tDesc.htmlText = "<b>" + getKEYS().Get("empiredestroyed2") + "</b>";
            }
            this.tWarning.htmlText = "<b>" + getKEYS().Get("msg_moveyard_warn2") + "</b>";
        } else {
            this.tDesc.htmlText = "<b>" + getKEYS().Get("empiredestroyed1") + "</b>";
            this.tWarning.visible = false;
        }
    }

    public Relocate(event: MouseEvent | null = null): void {
        const RelocateSuccess = (response: any): void => {
            PLEASEWAIT.Hide();
            if (response.error === 0) {
                if (response.cantMoveTill) {
                    getGLOBAL().Message(getKEYS().Get("movebase_warning", { v1: getGLOBAL().ToTime(response.cantMoveTill - response.currenttime) }));
                    this.Hide();
                } else {
                    getGLOBAL()._mapOutpost = [];
                    MapRoom.ClearCells();
                    if (response.coords && response.coords.length === 2 && response.coords[0] > -1 && response.coords[1] > -1) {
                        getGLOBAL()._mapHome = new Point(response.coords[0], response.coords[1]);
                        getMapRoomManager().instance.BookmarksClear();
                        MapRoom._Setup(getGLOBAL()._mapHome);
                        MapRoom.empireDestroyed = true;
                        getMapRoomManager().instance.ShowDelayed(true);
                    }
                }
            } else {
                getGLOBAL().ErrorMessage("PopupLostMainBase.Relocate 1");
                getLOGGER().Log("err", "PopupLostMainBase.Relocate non-zero error " + response.error);
            }
        };

        const RelocateFail = (event: IOErrorEvent): void => {
            PLEASEWAIT.Hide();
            getGLOBAL().ErrorMessage("PopupLostMainBase.Relocate 2");
            getLOGGER().Log("err", "PopupLostMainBase.Relocate HTTP");
        };

        const relocateVars: any[][] = [["type", "random"], ["baseid", 0], ["shiny", 0]];
        getPOPUPS().Next();
        PLEASEWAIT.Show(getKEYS().Get("wait_relocating"));
        new (getURLLoaderApi())().load(getGLOBAL()._baseURL + "migrate", relocateVars, RelocateSuccess, RelocateFail);
    }

    public Hide(event: MouseEvent | null = null): void {
        getPOPUPS().Next();
    }
}
