import { Bitmap } from "openfl/display/Bitmap";
import { BitmapData } from "openfl/display/BitmapData";
import { Sprite } from "openfl/display/Sprite";

import { ImageCache } from "../display/ImageCache";

import { CHAMPIONCAGE } from "../../../CHAMPIONCAGE";
import { CREATURELOCKER } from "../../../CREATURELOCKER";
import { GLOBAL } from "../../../GLOBAL";
import { KEYS } from "../../../KEYS";

// Declare clip class
declare class MapRoomPopupInfoMonster_CLIP extends Sprite {
    mcImage: any;
    tName: any;
}

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
            this.tName.htmlText = "<b>" + CHAMPIONCAGE._guardians[monsterID.substr(0, 2)].name + "</b>";
        } else {
            // Regular creature
            let name = String(CREATURELOCKER._creatures[monsterID].name);
            if (monsterID === "IC8") {
                name = "#m_k_wormzer#";
            }
            if (quantity) {
                this.tName.htmlText = "<b>" + KEYS.Get(name) + ": " + GLOBAL.FormatNumber(quantity) + "</b>";
            } else {
                this.tName.htmlText = "<b>" + KEYS.Get(name) + "</b>";
            }
        }
        
        if (!this._imageRequested) {
            ImageCache.GetImageWithCallBack("monsters/" + monsterID + "-small.png", ImageLoaded);
            this._imageRequested = true;
        }
    }
}
