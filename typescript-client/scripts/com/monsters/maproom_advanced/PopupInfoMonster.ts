import Bitmap from "openfl/display/Bitmap";
import BitmapData from "openfl/display/BitmapData";
import Sprite from "openfl/display/Sprite";

import { ImageCache } from "../display/ImageCache";

import { MapRoomPopupInfoMonster_CLIP } from "../../../MapRoomPopupInfoMonster_CLIP";

// Lazy imports to break circular dependency chains
function getCHAMPIONCAGE(): any { return require("../../../CHAMPIONCAGE").CHAMPIONCAGE; }
function getCREATURELOCKER(): any { return require("../../../CREATURELOCKER").CREATURELOCKER; }
function getGLOBAL(): any { return require("../../../GLOBAL").GLOBAL; }
function getKEYS(): any { return require("../../../KEYS").KEYS; }


/**
 * Monster info display for map room popups.
 */
export class PopupInfoMonster extends MapRoomPopupInfoMonster_CLIP {
    private _imageRequested: boolean = false;

    constructor() {
        super();
    }

    public Setup(X: number, Y: number, monsterID: string, quantity: number): void {
        const ImageLoaded = (path: string, data: BitmapData): void => {
            this.mcImage.addChild(new Bitmap(data));
            this.mcImage.width = 30;
            this.mcImage.height = 27;
        };
        
        this.x = X;
        this.y = Y;
        
        if (monsterID.substr(0, 1) === "G") {
            // Guardian/Champion
            this.tName.htmlText = "<b>" + getCHAMPIONCAGE()._guardians[monsterID.substr(0, 2)].name + "</b>";
        } else {
            // Regular creature
            let name = String(getCREATURELOCKER()._creatures[monsterID].name);
            if (monsterID === "IC8") {
                name = "#m_k_wormzer#";
            }
            if (quantity) {
                this.tName.htmlText = "<b>" + getKEYS().Get(name) + ": " + getGLOBAL().FormatNumber(quantity) + "</b>";
            } else {
                this.tName.htmlText = "<b>" + getKEYS().Get(name) + "</b>";
            }
        }
        
        if (!this._imageRequested) {
            ImageCache.GetImageWithCallBack("monsters/" + monsterID + "-small.png", ImageLoaded);
            this._imageRequested = true;
        }
    }
}
