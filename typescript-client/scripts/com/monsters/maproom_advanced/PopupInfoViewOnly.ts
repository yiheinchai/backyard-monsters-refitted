import Bitmap from "openfl/display/Bitmap";
import BitmapData from "openfl/display/BitmapData";
import Loader from "openfl/display/Loader";
import Sprite from "openfl/display/Sprite";
import Event from "openfl/events/Event";
import IOErrorEvent from "openfl/events/IOErrorEvent";
import MouseEvent from "openfl/events/MouseEvent";
import URLRequest from "openfl/net/URLRequest";

import { ImageCache } from "../display/ImageCache";
import { EnumYardType } from "../enums/EnumYardType";
import { MapRoom } from "./MapRoom";
import { MapRoomCell } from "./MapRoomCell";

import { PopupInfoViewOnly_CLIP } from "../../../PopupInfoViewOnly_CLIP";
import { frame } from "../../../frame";

// Lazy imports to break circular dependency chains
function getBASE(): any { return require("../../../BASE").BASE; }
function getGLOBAL(): any { return require("../../../GLOBAL").GLOBAL; }
function getKEYS(): any { return require("../../../KEYS").KEYS; }


// JSON declaration
declare const JSON: { encode(obj: any): string };

/**
 * View-only popup for cells the player can only view (not attack).
 */
export class PopupInfoViewOnly extends PopupInfoViewOnly_CLIP {
    private _cell: MapRoomCell | null = null;
    private _profilePic: Loader | null = null;
    private _profileBmp: Bitmap | null = null;

    constructor() {
        super();
        this.x = 760 / 2 + 75;
        this.y = 520 / 2;
        
        this.bView.SetupKey("map_view_btn");
        this.bView.addEventListener(MouseEvent.MOUSE_OVER, () => {
            this.ButtonInfo("view");
        });
        this.bView.addEventListener(MouseEvent.CLICK, () => {
            this.View();
        });
        
        (this.mcFrame as frame).Setup();
    }

    public Hide(event: MouseEvent | null = null): void {
        if (this._profilePic && this._profilePic.parent) {
            this._profilePic.parent.removeChild(this._profilePic);
            this._profilePic = null;
        }
        if (this._profileBmp && this._profileBmp.parent) {
            this._profileBmp.parent.removeChild(this._profileBmp);
            this._profileBmp = null;
        }
        MapRoom._mc.HideInfoViewOnly();
    }

    public Setup(cell: MapRoomCell, flingerInRange: boolean = false): void {
        this._cell = cell;
        
        this.tLabel1.htmlText = "<b>" + getKEYS().Get("popup_label_namelocheight") + "</b>";
        this.tLabel2.htmlText = "<b>" + getKEYS().Get("popup_label_thisyardhas") + "</b>";
        
        if (this._cell._base === 3) {
            if (this._cell._baseID === MapRoom._inviteBaseID) {
                this.tName.htmlText = "<b>" + getKEYS().Get("map_outpostowner", { v1: this._cell._name }) + " (" + getKEYS().Get("map_target") + ")</b>";
            } else if (!this._cell._destroyed) {
                this.tName.htmlText = "<b>" + getKEYS().Get("map_outpostowner", { v1: this._cell._name }) + "</b>";
            } else {
                this.tName.htmlText = "<b>" + getKEYS().Get("map_outpostowner", { v1: this._cell._name }) + " (" + getKEYS().Get("newmap_inf_destroyed") + ")</b>";
            }
            this.ProfilePic();
        } else if (this._cell._base === 2) {
            this.tName.htmlText = "<b>" + getKEYS().Get("map_yardowner", { v1: this._cell._name }) + "</b>";
            this.ProfilePic();
        } else if (this._cell._base === 1) {
            if (!this._cell._destroyed) {
                this.tName.htmlText = "<b>" + getKEYS().Get("ai_tribe", { v1: this._cell._name }) + "</b>";
            } else {
                this.tName.htmlText = "<b>" + getKEYS().Get("ai_tribe", { v1: this._cell._name }) + " (" + getKEYS().Get("newmap_inf_destroyed") + ")</b>";
            }
            this.ProfilePic();
        }
        
        this.tLocation.htmlText = this._cell.X + "x" + this._cell.Y;
        this.tHeight.htmlText = (this._cell._height - 100) + "m";
        
        let towerBonus: number;
        let resourceBonus: number;
        
        if (this._cell._base === 2) {
            towerBonus = 0;
            resourceBonus = 0;
        } else {
            towerBonus = Math.floor(this._cell._height * 100 / getGLOBAL()._averageAltitude.Get() - 100);
            resourceBonus = Math.floor(100 * getGLOBAL()._averageAltitude.Get() / this._cell._height - 100);
        }
        
        let towerStr: string;
        let resourceStr: string;
        
        if (towerBonus >= 0) {
            towerStr = '<font color="#003300">+' + getKEYS().Get("newmap_h1", { v1: towerBonus }) + '</font>';
        } else {
            towerStr = '<font color="#330000">- ' + getKEYS().Get("newmap_h1", { v1: Math.abs(towerBonus) }) + '</font>';
        }
        
        if (resourceBonus >= 0) {
            resourceStr = '<font color="#003300">+' + getKEYS().Get("newmap_h2", { v1: resourceBonus }) + '</font>';
        } else {
            resourceStr = '<font color="#330000">- ' + getKEYS().Get("newmap_h2", { v1: Math.abs(resourceBonus) }) + '</font>';
        }
        
        this.tBonus.htmlText = towerStr + "<br>" + resourceStr;
        this.ButtonInfo("view");
        this.Update();
    }

    private ProfilePic(): void {
        if (!this._cell) return;
        
        const onImageLoad = (event: Event): void => {
            if (this._profilePic) {
                this._profilePic.width = this._profilePic.height = 50;
                this._profilePic.contentLoaderInfo.removeEventListener(IOErrorEvent.IO_ERROR, LoadImageError);
                this._profilePic.contentLoaderInfo.removeEventListener(Event.COMPLETE, onImageLoad);
            }
        };
        
        const imageComplete = (path: string, data: BitmapData): void => {
            this._profileBmp = new Bitmap(data);
            (this.mcProfilePic as any).mcBG.addChild(this._profileBmp);
        };
        
        const LoadImageError = (event: IOErrorEvent): void => {
            if (this._profilePic) {
                this._profilePic.contentLoaderInfo.removeEventListener(IOErrorEvent.IO_ERROR, LoadImageError);
                this._profilePic.contentLoaderInfo.removeEventListener(Event.COMPLETE, onImageLoad);
            }
        };
        
        if (!this._cell._facebookID && this._cell._base !== 1 && !this._cell._pic_square) {
            return;
        }
        
        if (this._cell._base > 1) {
            this._profilePic = new Loader();
            if (!getGLOBAL()._flags.viximo) {
                this._profilePic.contentLoaderInfo.addEventListener(IOErrorEvent.IO_ERROR, LoadImageError, false);
                this._profilePic.contentLoaderInfo.addEventListener(Event.COMPLETE, onImageLoad);
                if (this._cell._pic_square) {
                    this._profilePic.load(new URLRequest(this._cell._pic_square));
                }
            } else {
                this._profilePic.contentLoaderInfo.addEventListener(IOErrorEvent.IO_ERROR, LoadImageError, false);
                this._profilePic.contentLoaderInfo.addEventListener(Event.COMPLETE, onImageLoad);
                this._profilePic.load(new URLRequest("http://graph.facebook.com/" + this._cell._facebookID + "/picture"));
            }
        } else {
            switch (this._cell._name) {
                case "Dreadnought":
                case "Dreadnaut":
                    ImageCache.GetImageWithCallBack("monsters/tribe_dreadnaut_50.v2.jpg", imageComplete);
                    break;
                case "Kozu":
                    ImageCache.GetImageWithCallBack("monsters/tribe_kozu_50.v2.jpg", imageComplete);
                    break;
                case "Legionnaire":
                    ImageCache.GetImageWithCallBack("monsters/tribe_legionnaire_50.v2.jpg", imageComplete);
                    break;
                case "Abunakki":
                    ImageCache.GetImageWithCallBack("monsters/tribe_abunakki_50.v2.jpg", imageComplete);
                    break;
            }
        }
    }

    public Cleanup(): void {
        if (this.mcFrame) {
            (this.mcFrame as frame).Clear();
            this.mcFrame = null;
        }
    }

    public View(): void {
        if (!this._cell) return;
        
        MapRoom.HideFromViewOnly();
        if (MapRoom._mc) {
            getGLOBAL()._attackerCellsInRange = MapRoom._mc.GetCellsInRange(this._cell.X, this._cell.Y, 10);
        }
        getGLOBAL()._currentCell = this._cell;
        
        if (this._cell._base === 1) {
            getBASE().LoadBase(null, 0, this._cell._baseID, "wmview", false, EnumYardType.MAIN_YARD);
        } else {
            const yardType = this._cell._base === 3 ? EnumYardType.OUTPOST : EnumYardType.MAIN_YARD;
            getBASE().LoadBase(null, 0, this._cell._baseID, "view", false, yardType);
        }
    }

    public ButtonInfo(buttonType: string): void {
        if (!this._cell) return;
        this.txtButtonInfo.htmlText = getKEYS().Get("newmap_view", { v1: this._cell._name });
        this.mcArrow.x = this.bView.x + this.bView.width / 2 - 5;
    }

    public Update(): void {
        if (!this._cell) return;
        
        let debugInfo = "";
        debugInfo = "X:" + this._cell.X + " Y:" + this._cell.Y + 
            "<br>_base:" + this._cell._base + 
            "<br>_height:" + this._cell._height + 
            "<br>_water:" + this._cell._water + 
            "<br>_mine:" + this._cell._mine + 
            "<br>_flinger:" + this._cell._flingerRange.Get() + 
            "<br>_catapult:" + this._cell._catapult + 
            "<br>_userID:" + this._cell._userID + 
            "<br>_truce:" + this._cell._truce + 
            "<br>_name:" + this._cell._name + 
            "<br>_protected:" + this._cell._protected + 
            "<br>_resources:" + JSON.encode(this._cell._resources) + 
            "<br>_ticks:" + JSON.encode(this._cell._ticks) + 
            "<br>_monsters:" + JSON.encode(this._cell._monsters);
        
        if (this._cell._monsterData) {
            debugInfo += "<br>_monsterData:" + JSON.encode(this._cell._monsterData);
            debugInfo += "<br>_monsterData.saved:" + JSON.encode(this._cell._monsterData.saved);
            debugInfo += "<br>_monsterData.h:" + JSON.encode(this._cell._monsterData.h);
            debugInfo += "<br>_monsterData.hcount:" + this._cell._monsterData.hcount;
        }
    }
}
